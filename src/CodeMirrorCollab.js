import React, {useEffect, useRef, useState} from "react";
import {basicSetup, EditorView} from "codemirror"
import {ViewPlugin} from "@codemirror/view"
import {xml} from "@codemirror/lang-xml"
import {ChangeSet, EditorState, StateField} from "@codemirror/state"
import {receiveUpdates, sendableUpdates, collab, getSyncedVersion} from "@codemirror/collab"
import {io} from 'socket.io-client'
import schema from './util/jsonSchema.json'
import {XMLValidator} from "fast-xml-parser";
import {Decoration} from "@codemirror/view"

const baseTheme = EditorView.baseTheme({
    ".error-line": {backgroundColor: "#e2582266"},
    ".changed-code": {backgroundColor: "#ac97e7cc"}
})
const errorLineDeco = Decoration.line({ class: "error-line" });

const changedCodeMark = Decoration.mark({class: "changed-code"})

const changedCodeField = StateField.define({
        create() {
            return Decoration.none;
        },
        update(section) {
            return section
        },
        provide: field => EditorView.decorations.from(field)
    }
)

const socket = io("http://127.0.0.1:5000");
// socket.on("connect", () => {
//     console.log(socket.id);
// });

function checkXML(data) {
    const result = XMLValidator.validate(data, {
        allowBooleanAttributes: true
    });
    if (result === true) {
        return({"err": {"msg": ""}})
    }
    else {
        return(result)
    }
}

function errorCheckAndValidationExtension(setValidation) {
    let plugin = ViewPlugin.fromClass(class {
        constructor(view) {
            this.view = view;
            this.err = checkXML(this.view.state.doc.toString());
            this.decorations = this.getDeco(this.err);
        }

        update(update){
            if(update.docChanged) {
                this.err = checkXML(this.view.state.doc.toString())
                this.decorations = this.getDeco(this.err);

                setValidation(this.err)
            }
        }

        // Add highlight to an error line
        getDeco(err) {
            let deco = []
            if (err.err.line) {
                const line = this.view.state.doc.line(err.err.line)
                deco.push(errorLineDeco.range(line.from))
            }
            return Decoration.set(deco);
        }

    },{
        decorations: v => v.decorations
    })
    return [plugin]
}

// Extension for updating the editor using built-in operational transformation
// functions in CodeMirror and syncing everything with the server
function updateExtension(startVersion, sock) {
    let pluginVersion = startVersion;
    let plugin = ViewPlugin.fromClass(class {
        constructor(view) {
            this.view = view;
            sock.on("newVersion", updates => {
                // console.log("These are the updates I just received! " + sock.id)
                // console.log(updates)
                // console.log("This is my current version: " + getSyncedVersion(this.view.state))
                let changes = receiveUpdates(this.view.state, this.makeUpdates(updates))
                this.view.dispatch(changes)
                this.changeHighlight(changes.changes.desc.sections)
                // console.log("This is my next version: " + getSyncedVersion(this.view.state))
                // console.log(receiveUpdates(this.view.state, this.makeUpdates(updates)))
            });

        }

        update(update) {
            if(update.docChanged) {

                if(sendableUpdates(this.view.state).length) {
                    // console.log("I'm updating!");
                    // console.log(sendableUpdates(this.view.state));
                    sock.emit("pushUpdates", getSyncedVersion(this.view.state), sendableUpdates(this.view.state));
                }

            }
        }

        makeUpdates(updates) {
            return updates.map(u => ({
                changes: ChangeSet.fromJSON(u.changes),
                clientID: u.clientID
            }))
        }

        changeHighlight(sections) {
            console.log("adding highlight")
            let index = 0;
            for (let i = 0; i < sections.length; i += 2) {
                console.log(sections[i], sections[i+1]);
                // This section has not changed
                if (sections[i+1] === -1) {
                    index = sections[i];
                }
                // This section has been deleted
                else if (sections[i+1] === 0) {
                    console.log("I will mark " + index + " as deleted")
                }
                // This section has had an insertion or a replacement
                else {
                    console.log("I will mark " + index + " as changed")
                    let effect = changedCodeMark.range(index, index+sections[i+1])
                    console.log(effect)
                    this.view.dispatch({effect})
                }
            }
            // sections.forEach(function (section) {
            //     console.log(section);
            // });
        }

    })
    return [collab({startVersion: pluginVersion}), plugin]
}

export default function CodeMirrorCollab() {
    const [validation, setValidation] = useState({"err": {"msg": ""}})
    const editor = useRef();
    useEffect(() => {
        let view = new EditorView({
            parent: editor.current
        })

        socket.on("firstVersion", (text, version) => {
            let state = EditorState.create({
                doc: text,
                extensions: [basicSetup, baseTheme, xml({elements: schema}), updateExtension(version, socket), errorCheckAndValidationExtension(setValidation)]
            });
            setValidation(checkXML(state.doc.toString()))
            view.destroy();
            view = new EditorView({
                state,
                parent: editor.current
            })
        })

        return () => {
            view.destroy();
        };
    }, []);

    return (
        <div>
            <div ref={editor}></div>
            <div id="validation-message">{validation.err.msg}</div>
        </div>
    );
}
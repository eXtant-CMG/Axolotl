import React, {useEffect, useRef, useState} from "react";
import {basicSetup, EditorView} from "codemirror"
import {ViewPlugin, drawSelection, Decoration, tooltips, keymap} from "@codemirror/view"
import {xml} from "@codemirror/lang-xml"
import {syntaxTree} from "@codemirror/language"
import {SearchCursor} from "@codemirror/search"
import {ChangeSet, EditorState, Compartment, EditorSelection} from "@codemirror/state"
import {indentWithTab} from "@codemirror/commands"
import {receiveUpdates, sendableUpdates, collab, getSyncedVersion} from "@codemirror/collab"
import {io} from 'socket.io-client'
import {saveAs} from 'file-saver';
import schema from '../util/jsonSchema.json'
import {baseTheme, errorLineDeco, placeholderMatcher, checkXML} from '../util/codemirror-util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import Button from 'react-bootstrap/Button'
import {Row} from "react-bootstrap";
import Cookies from "universal-cookie";

const cookies = new Cookies();
// initialize socket but don't connect because we might not have auth yet
const socket = io.connect("https://axolotl-server-db50b102d293.herokuapp.com/", {
    autoConnect: false,
    query: {
        token: cookies.get("TOKEN")
    }
});

const XMLView = new Compartment()

function createBlockViewExtension() {
    let plugin = ViewPlugin.fromClass(class {
        constructor(view) {
            this.view = view;
            this.placeholders = placeholderMatcher.createDeco(view)
        }

        update(update){
            if(update.docChanged || update.viewportChanged) {
                this.placeholders = placeholderMatcher.updateDeco(update, this.placeholders)
            }
        }

    },{
        decorations: instance => instance.placeholders
    })
    return [plugin]
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
                let changes = receiveUpdates(this.view.state, this.makeUpdates(updates))
                this.view.dispatch(changes)
            });
        }

        // update(update) {
        //     if(update.docChanged) {
        //
        //         // console.log('waiting to push')
        //         // Only emit if the changes are actually yours and not from the server
        //         if(sendableUpdates(this.view.state).length) {
        //             // console.log("I'm updating!");
        //             // console.log(sendableUpdates(this.view.state));
        //             sock.emit("pushUpdates", getSyncedVersion(this.view.state), sendableUpdates(this.view.state));
        //         }
        //     }
        //     if(update.startState.selection !== update.state.selection) {
        //         console.log(update.state.selection)
        //         sock.emit("newSelection", update.state.selection);
        //     }
        // }

        makeUpdates(updates) {
            return updates.map(u => ({
                changes: ChangeSet.fromJSON(u.changes),
                clientID: u.clientID
            }))
        }
    })
    return [collab({startVersion: pluginVersion}), plugin]
}

export default function CodeMirrorCollab({selection, disconnect}) {
    const [validation, setValidation] = useState({"err": {"msg": ""}})
    const editor = useRef();
    const viewRef = useRef();
    const [blockView, setBlockView] = useState(false);
    const [cursor, setCursor] = useState([]);

    if (!socket.connected) socket.connect()

    function exportXML() {
        let blob = new Blob([viewRef.current?.state.doc.toString()], {type: "application/xml"})
        saveAs(blob, 'file.xml')
    }

    function switchViews() {
        viewRef.current?.dispatch({
            effects: XMLView.reconfigure(blockView ? [] : createBlockViewExtension())
        })

        setBlockView(!blockView)
    }

    useEffect(() => {

        socket.on("firstVersion", (text, version) => {
            let state = EditorState.create({
                doc: text,
                extensions: [basicSetup, baseTheme, xml({elements: schema}), updateExtension(version, socket),
                                errorCheckAndValidationExtension(setValidation), XMLView.of([]),
                                EditorState.allowMultipleSelections.of(true), drawSelection(),
                                tooltips({parent: document.body}), keymap.of([indentWithTab])]
            });

            setValidation(checkXML(state.doc.toString()))
            viewRef.current = new EditorView({
                state,
                parent: editor.current
            })
        })

        socket.on("disconnect", function(reason) {
            console.log(reason)
            viewRef.current?.destroy();
        })

        return () => {
            viewRef.current?.destroy();
        }

    }, []);

    useEffect(() => {
        if (viewRef.current) {
            let cursor = new SearchCursor(viewRef.current?.state.doc, '\'#' + selection + '\'');
            cursor.next()

            const node = syntaxTree(viewRef.current?.state).cursorAt(cursor.value.from).node

            viewRef.current?.dispatch({
                selection: EditorSelection.create([
                    EditorSelection.range(node.from, node.to),
                    EditorSelection.cursor(node.from)
                ], 1),
                scrollIntoView: true
            })

            //TODO this is me trying to refocus after selection
            // viewRef.current?.focus();
            // editor.current?.firstChild.classList.add("cm-focused")
        }
    }, [selection])

    // If parents wants us to disconnect socket, we do
    useEffect(() => {
        if(disconnect) {
            socket.disconnect();
        }
    }, [disconnect])


    // send updates only every 2 seconds to avoid crowding socket (might not be best option)
    useEffect(() => {
        const interval = setInterval(() => {
            if(sendableUpdates(viewRef.current?.state).length) {
                socket.emit("pushUpdates", getSyncedVersion(viewRef.current?.state), sendableUpdates(viewRef.current?.state));
            }
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // this and the one above could probably just be one
    //TODO uncomment this later
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if(cursor !== viewRef.current?.state.selection) {
    //             setCursor(viewRef.current?.state.selection);
    //             socket.emit("newSelection", viewRef.current?.state.selection);
    //         }
    //     }, 2000);
    //
    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, [cursor])

    return (
        <div className={"h-100 d-flex flex-column"}>
            <div className="d-flex">
                <Button variant="light" title={'export XML'} onClick={exportXML}><FontAwesomeIcon icon={solid("file-export")} /></Button>
                <Button variant="light" title={'switch views'} onClick={() => switchViews()}><FontAwesomeIcon icon={solid("wand-magic-sparkles")} /></Button>
                <Button variant="light" title={'drag and move'} className={'drag-handle'}><FontAwesomeIcon icon={solid("up-down-left-right")} /></Button>
            </div>
            <Row className={"flex-grow-1 overflow-auto"}>
                <div ref={editor}></div>
            </Row>
            <Row>
                <div id="validation-message">{validation.err.msg}</div>
            </Row>
        </div>
    );
}
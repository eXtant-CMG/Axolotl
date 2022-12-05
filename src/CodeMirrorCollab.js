import {useEffect, useRef} from "react";
import {basicSetup, EditorView} from "codemirror"
import {ViewPlugin} from "@codemirror/view"
import {xml} from "@codemirror/lang-xml"
import {ChangeSet, EditorState, StateEffect, Text} from "@codemirror/state"
import {Update, receiveUpdates, sendableUpdates, collab, getSyncedVersion} from "@codemirror/collab"
import {io} from 'socket.io-client'
import schema from './util/jsonSchema.json'

const socket = io("http://127.0.0.1:5000");
socket.on("connect", () => {
    console.log(socket.id);
});

function makeUpdates(updates) {
    return updates.map(u => ({
        changes: ChangeSet.fromJSON(u.changes),
        clientID: u.clientID
    }))
}

function updateExtension(startVersion, sock) {
    let pluginVersion = startVersion;
    let plugin = ViewPlugin.fromClass(class {
        constructor(view) {
            this.view = view;
            sock.on("newVersion", updates => {

                console.log("These are the updates I just received! " + sock.id)
                console.log(updates)
                console.log("This is my current version: " + getSyncedVersion(this.view.state))
                this.view.dispatch(receiveUpdates(this.view.state, makeUpdates(updates)))
                console.log("This is my next version: " + getSyncedVersion(this.view.state))
                console.log(receiveUpdates(this.view.state, makeUpdates(updates)))
            });

        }

        update(update) {
            if(update.docChanged) {
                console.log("I'm updating!");
                console.log(sendableUpdates(this.view.state));
                sock.emit("pushUpdates", getSyncedVersion(this.view.state), sendableUpdates(this.view.state));
            }
        }

    })
    return [collab({startVersion: pluginVersion}), plugin]
}

export default function CodeMirrorCollab() {
    const editor = useRef();
    useEffect(() => {
        let view = new EditorView({
            parent: editor.current
        })

        socket.on("firstVersion", (text, version) => {
            console.log(text)
            console.log(version)
            let state = EditorState.create({
                doc: text,
                extensions: [basicSetup, xml({elements: schema}), updateExtension(version, socket)]
            });
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
            <div ref={editor}></div>
    );
}
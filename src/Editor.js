import React, {useEffect, useState} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import Sharedb from 'sharedb/lib/client';
import richText from 'rich-text';
import ReconnectingWebSocket from "reconnecting-websocket";
import {XMLValidator} from "fast-xml-parser";


// Registering the rich text type to make sharedb work
// with our quill editor
Sharedb.types.register(richText.type);
// const ReconnectingWebSocket = require('reconnecting-websocket');
// Connecting to our socket server
const socket = new ReconnectingWebSocket('ws://127.0.0.1:8080');
const connection = new Sharedb.Connection(socket);

// Querying for our document
const doc = connection.get('documents', 'firstDocument');

function checkXML(data) {
    const result = XMLValidator.validate(data.ops[0].insert, {
        allowBooleanAttributes: true
    });
    if (result === true) {
        return("")
    }
    else {
        console.log(result)
        return("Invalid XML:\n" + result.err.msg)
    }
}

function Editor() {
    const [validation, setValidation] = useState("")
    useEffect(() => {

        doc.subscribe(function (err) {

            if (err) throw err;

            const toolbarOptions = ['bold', 'italic', 'underline', 'strike', 'align'];
            const options = {
                theme: 'bubble',
                modules: {
                    toolbar: [toolbarOptions, ['code-block']],

                },
            };
            let quill = new Quill('#editor', options);
            /**
             * On Initialising if data is present in server
             * Updating its content to editor
             */
            quill.setContents(doc.data);
            setValidation(checkXML(doc.data))
            /**
             * On Text change publishing to our server
             * so that it can be broadcasted to all other clients
             */
            quill.on('text-change', function (delta, oldDelta, source) {
                if (source !== 'user') return;
                doc.submitOp(delta, { source: quill });
                setValidation(checkXML(doc.data))
                // quill.formatLine(4,4,"background","blue");
            });

            /** listening to changes in the document
             * that is coming from our server
             */
            doc.on('op', function (op, source) {
                if (source === quill) return;
                quill.updateContents(op);
                setValidation(checkXML(quill.getContents()))
            });
        });
        return () => {
            // connection.close();
        };
    }, []);

    return (
        <div style={{ margin: '5%', border: '1px solid' }}>
            <div id="validation-message">{validation}</div>
            <div id='editor'></div>
        </div>
    );
}

export default Editor;
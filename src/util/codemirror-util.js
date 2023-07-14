import {Decoration, MatchDecorator, WidgetType} from "@codemirror/view";
import {syntaxTree} from "@codemirror/language";
import {StateEffect, StateField} from "@codemirror/state";
import {EditorView} from "codemirror";
import {XMLValidator} from "fast-xml-parser";

const nameTranslate = {
    'l': 'line',
    'lg': 'line group',
    'p': 'paragraph',
    '?xml': 'XML',
    'teiHeader': 'TEI header',
    'fileDesc': 'file description',
    'titleStmt': 'title statement',
    'publicationStmt': 'publication statement',
    'sourceDesc': 'source description',
    'bibl': 'bibliographic citation',
    'pb': 'page beginning'
}

class PlaceholderWidget extends WidgetType {
    constructor(value) {
        super();
        this.value = value
    }
    toDOM() {
        if (this.value[0] === '/')
            return document.createElement('span')
        const placeHolder = document.createElement('div')
        placeHolder.classList.add('placeholder')
        const untranslated = this.value.split(' ')[0]
        const translated = nameTranslate[untranslated]
        placeHolder.textContent = translated ? translated : untranslated
        return placeHolder
    }
}

export const placeholderMatcher = new MatchDecorator({
    regexp: /<[^<>]+>/g,
    decoration: match => Decoration.replace({
        widget: new PlaceholderWidget(match[0].slice(1, -1)),
    })
})

export function checkXML(data) {
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

export const baseTheme = EditorView.baseTheme({
    ".error-line": {backgroundColor: "#e2582266"},
})

export const errorLineDeco = Decoration.line({ class: "error-line" });

export const addHighlight = StateEffect.define()
export const removeHighlight = StateEffect.define()

export function createHighlightDecoration(socketId) {
    return Decoration.mark({
        attributes: { style: "background-color: #4da1de4d"},
        socketId: socketId
    })
}

export class CheckboxWidget extends WidgetType {
    constructor(username, socketId) {
        super()
        this.username = username;
        this.socketId = socketId;
    }

    eq(other) { return other.socketId === this.socketId }

    toDOM(view) {
        let wrap = document.createElement("span")
        wrap.setAttribute("aria-hidden", "true")
        wrap.appendChild(document.createTextNode(this.username))
        wrap.style.color = "black"
        wrap.style.fontSize = "7px"
        wrap.style.position = "absolute"
        wrap.style.borderRadius = "10px"
        wrap.style.backgroundColor = "#4da1de4d"
        return wrap
    }

    ignoreEvent(event) { return false }
}


function treeMatcher(view) {
    let widgets = []
    for (let {from, to} of view.visibleRanges) {
        syntaxTree(view.state).iterate({
            from, to,
            enter: (node) => {
                if (node.name === "Element") {
                    console.log(view.state.doc.sliceString(node.from, node.to))
                    let deco = Decoration.replace({
                        widget: new PlaceholderWidget(view.state.doc.sliceString(node.from, node.to))
                    })
                    widgets.push(deco.range(node.from, node.to))
                }
            }
        })
    }
    return Decoration.set(widgets)
}

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

// currently not used
let xmlTree = StateField.define({
    create() {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString("","text/xml");
        return xmlDoc;
    },
    update(value, tr) {
        if (tr.docChanged) {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(tr.newDoc.toString(),"text/xml");
            console.log(xmlDoc)
        }
        else return value
    }
})


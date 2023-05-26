import React from "react";
import pic from './oxen.jpg';
import { getAnnotationsFromXml } from './util/annotation-util'
import {
    TransformWrapper,
    TransformComponent,
} from "react-zoom-pan-pinch";

import { useEffect, useRef, useState } from 'react';
import { Annotorious } from '@recogito/annotorious';

import '@recogito/annotorious/dist/annotorious.min.css';

function AnnotationContainer({onSelection}) {

    // Ref to the image DOM element
    const imgEl = useRef();

    // The current Annotorious instance
    const [ anno, setAnno ] = useState();

    // Current drawing tool name
    const [ tool, setTool ] = useState('rect');

    // Init Annotorious when the component
    // mounts, and keep the current 'anno'
    // instance in the application state
    useEffect(() => {
        let annotorious = null;

        if (imgEl.current) {
            // Init
            annotorious = new Annotorious({
                image: imgEl.current,
                disableEditor: true,
            });

            // Attach event handlers here
            annotorious.on('createAnnotation', annotation => {
                console.log('created', annotation);
            });

            annotorious.on('updateAnnotation', (annotation, previous) => {
                console.log('updated', annotation, previous);
            });

            annotorious.on('deleteAnnotation', annotation => {
                console.log('deleted', annotation);
            });

            annotorious.on('selectAnnotation', function(annotation, element) {
                onSelection(element.getAttribute('data-id'));
            });

            annotorious.loadAnnotations(createAnnotationUrl());
        }

        // Keep current Annotorious instance in state
        setAnno(annotorious);

        // Cleanup: destroy current instance
        return () => {
            annotorious.destroy();
        };
    }, []);

    // Toggles current tool + button label
    const toggleTool = () => {
        if (tool === 'rect') {
            setTool('polygon');
            anno.setDrawingTool('polygon');
        } else {
            setTool('rect');
            anno.setDrawingTool('rect');
        }
    }


    return (
        <div>
            <TransformWrapper
                initialScale={1}
                minScale={0.05}
                wheel={{disabled: true}}
                panning={{disabled: true}}
                minPositionX={0}
                minPositionY={300}
                // centerOnInit={true}
                // centerZoomedOut={true}
                // limitToBounds={false}
                // disablePadding={true}
            >
                {({ zoomIn, zoomOut, resetTransform, centerView}) => (
                    <React.Fragment>
                        <div className="tools">
                            <button onClick={() => zoomIn(0.1)}>+</button>
                            <button onClick={() => zoomOut(0.1)}>-</button>
                            <button onClick={() => resetTransform()}>x</button>
                            <button onClick={() => centerView()}>o</button>
                        </div>
                        <div className="annotation">
                        <TransformComponent wrapperStyle={{ maxWidth: "100%", maxHeight: "550px", overflow: "scroll"}}>

                            <img className="annotationnnn"
                            ref={imgEl}
                            src={pic}/>

                        </TransformComponent>
                        </div>
                    </React.Fragment>
                )}
            </TransformWrapper>
        </div>
    );
}

function createAnnotationUrl() {
    const annotationJson = getAnnotationsFromXml('path')
    const blob = new Blob([JSON.stringify(annotationJson)], {type: "application/json"})
    return(URL.createObjectURL(blob));
}

export default AnnotationContainer;


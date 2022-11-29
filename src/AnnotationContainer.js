import {Component} from "react";
import Annotation from "react-image-annotation/lib/components/Annotation";
import pic from './img.jpg'

export default class AnnotationContainer extends Component {
    state = {
        annotations: [],
        annotation: {}
    }

    onChange = (annotation) => {
        this.setState({ annotation })
    }

    onSubmit = (annotation) => {
        const { geometry, data } = annotation

        this.setState({
            annotation: {},
            annotations: this.state.annotations.concat({
                geometry,
                data: {
                    ...data,
                    id: Math.random()
                }
            })
        })
    }

    render () {
        return (
            <Annotation className="p-3"
                src={pic}
                alt='Two pebbles anthropomorphized holding hands'

                annotations={this.state.annotations}

                type={this.state.type}
                value={this.state.annotation}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
            />
        )
    }
}
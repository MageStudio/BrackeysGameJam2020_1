import { Component } from 'inferno';

export default class UIContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            overlayVisible: true
        }
    }

    onOverlayButtonClick = () => {
        const { onOverlayButtonClick } = this.props;

        this.setState({
            overlayVisible: false
        });

        onOverlayButtonClick();
    };

    render() {
        const { overlayVisible } = this.state;
        const classname = 'overlay '.concat(overlayVisible ? 'visible' : 'invisible');

        return (
            <div className={classname}>
                <h1 className={'gametitle'}>The Wrong Hole</h1>
                <button onClick={this.onOverlayButtonClick}>
                    START
                </button>
            </div>
        )
    }
}

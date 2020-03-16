import { Component } from 'inferno';

export default class MainMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            overlayVisible: true
        }
    }

    onStartButtonClick = () => {
        const { onStartButtonClick } = this.props;

        this.setState({
            overlayVisible: false
        });

        onStartButtonClick();
    };

    render() {
        const { overlayVisible } = this.state;
        const classname = 'overlay '.concat(overlayVisible ? 'visible' : 'invisible');

        return (
            <div className={classname}>
                <div className='menucontainer'>
                    <h1 className={'gametitle'}>The Wrong Hole</h1>
                    <ul className='menu'>
                        <li>
                            <button className='menu-button' onClick={this.onStartButtonClick}>
                                START
                            </button>
                        </li>
                        <li>
                            <button className='menu-button' onClick={this.onResumeButtonClick}>
                                RESUME
                            </button>
                        </li>
                        <li>
                            <button className='menu-button' onClick={this.onAboutButtonClick}>
                                ABOUT
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

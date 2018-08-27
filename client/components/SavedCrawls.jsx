import { Component } from 'react';
import axios from 'axios';
import styles from './SavedCrawls.css';

export default class SavedCrawls extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crawls: [],
        }
    }

    componentDidMount() {
        const socket = io();
        socket.on('crawl saved', (data) => {
            this.state.crawls.push({pubCrawl: data});
            console.log(this.state.crawls);
            this.setState({ crawls: this.state.crawls })
        });
        axios.get('/user/pubcrawl/chris')
        .then(res => {
            console.log(res)
            this.setState({ crawls: res.data })
        })
        .catch(err => console.log(err))
    }

    render() {
        const { crawls } = this.state;
        return (
            <div className="SavedCrawlsContainer">
                {crawls.reverse().map((crawl, index) => {
                    return (
                        <div>
                            <span className="textInlineWithImage">#{index}&nbsp;&nbsp;</span>
                            {crawl.pubCrawl.map(business => <Business info={business} />)}
                        </div>
                    )
                })}
            </div>
        )
    }
}

const Business = ({ info }) => (
    <span>
        <div className="inlineBlock">
                <div className="textInlineWithImage">{info.name}&nbsp;</div>
        </div>
        <div className="inlineBlock">
            <img className="businessImage" src={info.image_url} /> 
        </div>
        <div className="inlineBlock">
        <div className="textInlineWithImage">=></div>
        </div>

    </span>
)
import { Component } from 'react';
import axios from 'axios';
import styles from './CreateCrawl.css';
import { isObject } from 'util';


export default class CreateCrawl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businesses: [],
            input: '',
            crawl: [],
            user: 'chris',
            usernameInput: '',
        }
    }

    componentDidMount() {
        // this.searchYelp('tempest')
    }

    searchYelp(input) {
        axios.get(`/yelp/${input}`)
        .then(res => {
            console.log(res.data)
            this.setState({businesses: res.data.jsonBody.businesses})
        })
        .catch(err => console.error(err))
    }

    changeInput(e, type) {
        e.which === 13 && type === 'search' && this.handleSubmit()
        type === 'search' ? this.setState({ input: e.target.value }) : this.setState({ usernameInput: e.target.value })
    }

    setUser() {
        this.setState({ 
            user: this.state.usernameInput,
            usernameInput: '',
        })
    }

    handleSubmit() {
        this.searchYelp(this.state.input);
        this.setState({ input: '' })
    }

    addToCrawl(info) {
        this.state.crawl.push({ name: info.name, image_url: info.image_url });
        this.setState({ crawl: this.state.crawl })
        console.log(this.state.crawl)
    }

    removeFromCrawl(info) {
        const { crawl } = this.state;
        console.log('remove called');
        const index = crawl.indexOf(info);
        index !== -1 && crawl.splice(index, 1);
        this.setState({ crawl })
    }

    savePubCrawl() {
        const socket = io();
        socket.emit('crawl saved', this.state.crawl)
        axios.post(`/user/pubCrawl`, {
            data: this.state.crawl,
            user: this.state.user
        })
        .then(res => console.log(res))
        .catch(err => console.error(err));
    }

    render() {
        const { businesses, crawl } = this.state
        return (
            <div className="CreateCrawlContainer">
                <span className="CreateSearchContainer">
                    <input type="text" size="30" onKeyUp={(e) => this.changeInput(e, 'user')} placeholder="Set your username"/>
                    <button onClick={() => this.setUser()}>Set Username</button>
                    <span> Current User: {this.state.user}</span>
                </span>
                <div className="CreateSearchContainer">
                    <input type="text" size="60" onKeyUp={(e) => this.changeInput(e, 'search')} placeholder="Search for your favorite places"/>
                    <button onClick={() => this.handleSubmit()}>Search</button>
                </div>
                <div>
                    <div className="leftText">Select Your Places</div>
                    <div className="twoHalvesInline" id="newCrawlList">
                        {businesses.map(business => <Business info={business} addToCrawl={this.addToCrawl.bind(this)} canAdd={true}/>)}
                    </div>

                    <div className="twoHalvesInline" id="newCrawlList">
                        <div>Your PubCrawl</div>
                        <div>
                            <button onClick={() => this.savePubCrawl()}>Create it and Save</button>
                        </div>
                        {crawl.map(business => <Business info={business} removeFromCrawl={this.removeFromCrawl.bind(this)} canAdd={false}/>)}
                    </div>
                </div>
            </div>
        )
    }
}

const Business = ({ info, addToCrawl, removeFromCrawl, canAdd }) => (
    <div className="BusinessContainer" onClick={() => canAdd ? addToCrawl(info) : removeFromCrawl(info)}>
        <div>{info.name}</div>
        <div><img className="businessImage" src={info.image_url} /></div>
    </div>
)
/**
 * - render.js = MAIN COMPONENT
 * - Files are imported through the Gulp process, and these required statements are going to be processed by the Browserify plugin.
 *  - So their job is going to be to just copy and paste those libraries into this render.js that is going to be then sent to the app folder
 */

//LIBRARIES
const $ = jQuery = require('jquery');
const _ = require('lodash');
const bootstrap = require('bootstrap');
const fs = eRequire('fs');
const loadApts = JSON.parse(fs.readFileSync(dataLocation));

//electron
const electron = eRequire('electron');
//make ipc available in this container
const ipc = electron.ipcRenderer;

//react
const React = require('react');
const ReactDOM = require('react-dom');
const AptList = require('./AptList');
const Toolbar = require('./Toolbar');
const HeaderNav = require('./HeaderNav');
const AddAppointment = require('./AddAppointment');

const MainInterface = React.createClass({
    /**set up initial state of app*/
    getInitialState: function() {
        return {
            aptBodyVisible: false,
            orderBy: 'petName',
            orderDir: 'asc',
            queryText: '',
            myAppointments: loadApts
        }
    },

    /**
     * LIFECYCLE METHODS = (read about it on react documentation)
     * Once we save/delete an element and the list gets re-rendered, then the file data gets saved/registered to the hard drive.
     * In this life cycle method in the render method we are automatically saving this state of the application whenever the component updates.
     * That means that whenever we change the data for the component, it's going to automatically save the file for us.
     * We don't need to do a separate save for doing things in different places.
     * Any change to the state is going to automatically save things for us
     * So if we refresh the page, it's going to re-read the data that we have modified.
     * */


    /**ipc is the way to communicate between the two processes (ie: electron and react) when we're working with menus*/
    //componentDidMount
    /**custom menus from electron*/
    componentDidMount: function() {
        ipc.on('addAppointment', function(event,message) {
            this.toggleAptDisplay();
        }.bind(this));
    },

    /**turn off event*/
    componentWillUnmount: function() {
        ipc.removeListener('addAppointment', function(event,message) {
            this.toggleAptDisplay();
        }.bind(this));
    },

    //componentDidUpdate
    componentDidUpdate: function() {
        /**what to write stringfy data.json saved as dataLocation*/
        fs.writeFile(dataLocation, JSON.stringify(this.state.myAppointments), 'utf8', function(err) {
            if (err) {
                console.log(err);
            }
        });
    },


    //toggleAddDisplay ()
    toggleAptDisplay: function() {
        /**allow us to show or hide the bootstrap modal*/
        let tempVisibility = !this.state.aptBodyVisible;
        this.setState({
            aptBodyVisible: tempVisibility
        });
    },


    //showAbout ()
    showAbout:function() {
        /**sendSync method will send an event from our renderer process to our main process.*/
        ipc.sendSync('openInfoWindow'); //on electron main.js
    },


    //delete ()
    deleteMessage: function(item) {
        let allApts = this.state.myAppointments;
        /**loadash*/
        let newApts = _.without(allApts, item);
        this.setState({
            myAppointments: newApts
        });
    },


    //addApt ()
    addItem: function(tempItem) { //receive tempItem
        /**modify state*/
        let tempApts = this.state.myAppointments;
        tempApts.push(tempItem);
        this.setState({
            myAppointments: tempApts,
            /**turn off form (react to it!)*/
            aptBodyVisible: false
        });
    },


    //reOrder()
    reOrder: function(orderBy, orderDir) {
        this.setState({
            orderBy: orderBy,
            orderDir: orderDir
        })
    },


    //searchApt()
    searchApts: function(query) {
        this.setState({
            /**add this variable to our state*/
            queryText: query
        })
    },

    //Render function is what react.js uses whenever it needs to redraw the browser window, in this case the application window
    render: function() {
        let filteredApts = [];
        let queryText = this.state.queryText;
        let orderBy = this.state.orderBy;
        let orderDir = this.state.orderDir;

        let myAppointments = this.state.myAppointments;

        /**jQuery*/
        if (this.state.aptBodyVisible === true) {
            $('#addAppointment').modal('show');
        } else {
            $('#addAppointment').modal('hide');
        }

        /**Regular expressions are sort 'search on steroids' that let you do case-insensitive and more powerful searches.*/
        let userSearch = new RegExp(queryText, 'i'); //'i' stands for case insensitive

        /**loop through queryText*/
        myAppointments.forEach(function(item) {
            if(
                /**The JS search() method searches a string for a specified value, and returns the position of the match.*/
            (item.petName.search(userSearch)!=-1) ||
            (item.ownerName.search(userSearch)!=-1) ||
            (item.aptDate.search(userSearch)!=-1) ||
            (item.aptNotes.search(userSearch)!=-1)
            )
            {
                filteredApts.push(item);
            }
        });

        //Lodash order by
        filteredApts = _.orderBy(filteredApts, function(item) {
            return item[orderBy].toLowerCase();
        }, orderDir);

        //Insert component data by mapping a list of appts
        /**myAppointments=myAppointments.map(function(item, index) {*/
        // display the new filtered appointments, so instead of mapping myAppointments I'm going to map filteredApts
        filteredApts=filteredApts.map(function(item, index) {
            return(
                /**One thing you have to watch out for about Electron, is that lists do have to have a key as well as an identifier.*/
                //props
                <AptList key = {index}
                         singleItem = {item}
                         whichItem =  {item}
                         onDelete = {this.deleteMessage}
                />
            )
        }.bind(this)); /**Appointments.map*/
        return(
            <div className="application">
                {/**HeaderNav*/}
                <HeaderNav
                    orderBy = {this.state.orderBy}
                    orderDir =  {this.state.orderDir}
                    onReOrder = {this.reOrder}
                    onSearch = {this.searchApts}
                />
                <div className="interface">
                    {/**Toolbar*/}
                    <Toolbar
                        handleToggle = {this.toggleAptDisplay}
                        handleAbout = {this.showAbout}
                    />
                    {/**add appt*/}
                    <AddAppointment
                        handleToggle = {this.toggleAptDisplay}
                        addApt = {this.addItem}
                    />
                    <div className="container">
                        <div className="row">
                            <div className="appointments col-sm-12">
                                <h2 className="appointments-headline">Current Appointments</h2>
                                {/**<ul className="item-list media-list">{myAppointments}</ul>*/}
                                <ul className="item-list media-list">{filteredApts}</ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } //render
});//MainInterface



ReactDOM.render(
    <MainInterface />,
    document.getElementById('petAppointments')
);




//************************************************************************************************************************************************************************************
/**
 * jQuery testing
 */
// $(function(){
//     $('#petAppointments').append('<h3 class="text-success">App Loaded</h3><button class="btn btn-danger">We\'re in business!</button> ');
// });


/**
 * Notes:
 * Most of the time with React we would use a life cycle method to import some data and perhaps an AJAX call to bring that data in
 * But because we have node.js we can just use the require command and the file system to bring in files.
 * We do have to be a bit careful with require commands because of what's happening when you're also working with a process that uses browserify.
 */

/**
 * Resources
 * xml
 * https://gist.github.com/planetoftheweb/bcf47b713e6aabc7fafd802c918a384f
 * css
 * https://gist.github.com/planetoftheweb/1218559243e5449bd3d4b76a06f7cd66
 * bootstrap modal
 * https://gist.github.com/planetoftheweb/ec395241207d186f15bd74b0e8621f2c
 * Ray
 * https://api.github.com/users/planetoftheweb
 */

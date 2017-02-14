const React = require('react');

const Toolbar = React.createClass({

    //create appt
    createAppointments: function(){
        this.props.handleToggle();
    },

    //toggle
    toggleAbout: function (){
        this.props.handleAbout();
    },

    render: function(){
        return(
            <div className="toolbar">
                {/*create appts*/}
                <div className="toolbar-item" onClick={this.createAppointments}>
                    <span className="toolbar-item-button glyphicon glyphicon-plus-sign"></span>
                    <span className="toolbar-item-text">Add Appointment</span>
                </div>
                {/*toggle*/}
                <div className="toolbar-item" onClick={this.toggleAbout}>
                    <span className="toolbar-item-button glyphicon glyphicon-question-sign"></span>
                    <span className="toolbar-item-text">About this app</span>
                </div>
            </div>
        )
    }
});

module.exports = Toolbar;
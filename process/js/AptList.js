/**
 * Components
 * Make sure that you name it properly. It has to be CamelCase, with the first letter being capitalized.
 */
const React = require('react');

const AptList = React.createClass({

    //delete
    handleDelete: function(){
        this.props.onDelete(this.props.whichItem);
    },
    render: function(){
        return (
            <li className="pet-item media">
                <div className="media-left">
                    {/**delete*/}
                    <button className="pet-delete btn btn-xs btn-danger" onClick={this.handleDelete}>
                    <span className="glyphicon glyphicon-remove"></span></button>
                </div>
                <div className="pet-info media-body">
                    <div className="pet-head">
                        <span className="pet-name">{this.props.singleItem.petName}</span>
                        <span className="apt-date pull-right">{this.props.singleItem.aptDate}</span>
                    </div>
                    <div className="owner-name"><span className="label-item">Owner:</span>
                        {this.props.singleItem.ownerName}</div>
                    <div className="apt-notes">{this.props.singleItem.aptNotes}</div>
                </div>
            </li>
            )
    }
});

module.exports = AptList;
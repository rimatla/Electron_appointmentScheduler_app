const React = require('react');

//vanila js
//set a default date
let defaultDate = new Date();
//schedule for TWO WEEKS from today
defaultDate.setDate(defaultDate.getDate() + 14);

//format how JS outputs dates
function formatDate(date, divider) {
    let someday = new Date(date);
    let month = someday.getUTCMonth() + 1;
    let day = someday.getUTCDate();
    let year = someday.getUTCFullYear();

    if (month <= 9) { month = '0' + month; }
    if (day <= 9) { day = '0' + day; }

    return ('' + year + divider + month + divider + day);
}

const AddAppointment = React.createClass({

    //toggle app display
    toggleAptDisplay: function() {
        this.props.handleToggle();
    },

    //handleAdd (save data from forms)
    handleAdd: function(e) {
        /**don't refresh page on form submit*/
        e.preventDefault();
        /**hold data temporally*/
        let tempItem = {
            petName: this.inputPetName.value,
            ownerName: this.inputPetOwner.value,
            aptDate: this.inputAptDate.value + ' ' + this.inputAptTime.value,
            aptNotes: this.inputAptNotes.value,
        };

        /**then pass it along w/ props*/
        this.props.addApt(tempItem);

        /**clear form input fields and reset the appt date value*/
        this.inputPetName.value = '';
        this.inputPetOwner.value = '';
        this.inputAptDate.value = formatDate(defaultDate, '-');
        this.inputAptTime.value = '09:00';
        this.inputAptNotes.value = '';
    },

    render: function() {
        return(
            /**bootstrap modal*/
            <div className="modal fade" id="addAppointment" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.toggleAptDisplay} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">Add an Appointment</h4>
                        </div>

                        {/**submit form/save data*/}
                        <form className="modal-body add-appointment form-horizontal" onSubmit={this.handleAdd}>
                            <div className="form-group">
                                <label className="col-sm-3 control-label" htmlFor="petName">Pet Name</label>
                                {/**References allow us to read values from the field and then pass them along*/}
                                <div className="col-sm-9">
                                    <input type="text" className="form-control"
                                           id="petName" ref={(ref) => this.inputPetName = ref } placeholder="Pet's Name" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label" htmlFor="petOwner">Pet Owner</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control"
                                           id="petOwner"  ref={(ref) => this.inputPetOwner = ref } placeholder="Owner's Name" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label" htmlFor="aptDate">Date</label>
                                {/**format date*/}
                                <div className="col-sm-9">
                                    <input type="date" className="form-control"
                                           id="aptDate"  ref={(ref) => this.inputAptDate = ref } defaultValue={formatDate(defaultDate, '-')} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label" htmlFor="aptTime">Time</label>
                                {/** set an automatic date*/}
                                <div className="col-sm-9">
                                    <input type="time" className="form-control"
                                           id="aptTime"  ref={(ref) => this.inputAptTime = ref } defaultValue={'09:00'} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label" htmlFor="aptNotes">Apt. Notes</label>
                                <div className="col-sm-9">
                  <textarea className="form-control" rows="4" cols="50"
                            id="aptNotes"  ref={(ref) => this.inputAptNotes = ref } placeholder="Appointment Notes"></textarea>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-offset-3 col-sm-9">
                                    <div className="pull-right">
                                        <button type="button" className="btn btn-default"  onClick={this.toggleAptDisplay}>Cancel</button>&nbsp;
                                        <button type="submit" className="btn btn-primary">Add Appointment</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports=AddAppointment;

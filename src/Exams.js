import React from 'react';
import './Exams.css';

const Exams = (props) => {
  return (
    <div>
      <div className='container exam'>
        <h2>Exams</h2>
        <section className='add-exam'>
        {props.showAddExam ?
          <div>
            <form onSubmit={props.handleSubmit}>
              <p>User:</p>
              <input required="required" maxLength="40" type="text" name="username" readOnly = {true} value={props.google_user.displayName || props.google_user.email} />

              <p>Exam title:</p>
              <input required="required" maxLength="40" type="text" name="newTitle" placeholder="Enter the title of your exam" onChange={props.handleChange} value={props.newTitle} />

              <p>Company name:</p>
              <input required="required" maxLength="40" type="text" name="company" placeholder="Enter the name of your company" onChange={props.handleChange} value={props.company} />

              <p>Description:</p>
              <textarea rows="3" maxLength="500" required="required" type="text" name="description" placeholder="Enter a description for your exam" onChange={props.handleChange} value={props.description} />

              {props.acceptButton ? <button className='success'><i className="fa fa-check-circle" aria-hidden="true"></i>Accept</button>
              : <button className='success' disabled><i className="fa fa-check-circle" aria-hidden="true"></i>Accept</button>}


              <button type="button" className='warning' onClick = {() => {props.showAddModule(false); props.clearFields();}}><i className="fa fa-times-circle" aria-hidden="true"></i>Cancel</button>
            </form>
          </div>
          :
          <button className='info' onClick = {() => {props.showAddModule(true); props.clearFields();}}><i className="fa fa-plus-circle" aria-hidden="true"></i>Add Exam</button>
        }
        </section>
        <section className='edit-exam'>
        {props.showEditExam ?
          <div>
            <form onSubmit={props.handleEdit}>
              <p>User:</p>
              <input required="required" maxLength="40" type="text" name="username" readOnly = {true} value={props.google_user.displayName || props.google_user.email} />

              <p>Exam title:</p>
              <input required="required" maxLength="40" type="text" name="newTitle" placeholder="Enter the title of your exam" onChange={props.handleChange} value={props.newTitle} />

              <p>Company name:</p>
              <input required="required" maxLength="40" type="text" name="company" placeholder="Enter the name of your company" onChange={props.handleChange} value={props.company} />

              <p>Description:</p>
              <textarea rows="3" maxLength="500" required="required" type="text" name="description" placeholder="Enter a description for your exam" onChange={props.handleChange} value={props.description} />

              {props.editButton ? <button className='success'><i className="fa fa-check-circle" aria-hidden="true"></i>Accept</button>
              : <button className='success' disabled><i className="fa fa-check-circle" aria-hidden="true"></i>Accept</button>}


              <button type="button" className='warning' onClick = {() => {props.showEditModule(false); props.clearFields()}}><i className="fa fa-times-circle" aria-hidden="true"></i>Cancel</button>
            </form>
          </div>
          :
          <div></div>
        }
        </section>
        <section className='display-exam'>
          <div className="wrapper display">
            <ul>
              {props.exams.map((exam) => {
                var selected = '';
                console.log("Comparacion", exam.id, "+", props.currentExamId);
                if(exam.id === props.currentExamId) {
                  selected = 'selected';
                }
                return (
                  <li className={selected} key={exam.id}>
                    <h3>{exam.title}</h3>
                    <div>
                      <div className='exam-info'>
                        <p><b>User:</b> {exam.username}</p>
                        <p><b>Company:</b> {exam.company}</p>
                        <p><b>Description:</b></p>
                        <textarea rows="2" cols="50" value={exam.description} readOnly></textarea>
                      </div>
                       <div className='exam-actions'>
                        <button onClick={() => props.editExam(exam)}><i className="fa fa-pencil" aria-hidden="true"></i>Edit</button>
                        <a href="#test-section"><button onClick={() => {props.selectExam(exam.id); props.showAddModule(false); props.showEditModule(false); props.clearFields();}}><i className="fa fa-files-o" aria-hidden="true"></i>Tests</button></a>
                        <a href="#qr-section"><button onClick={() => {props.selectExam(exam.id); props.shareExam(exam.id); props.showAddModule(false); props.showEditModule(false); props.clearFields();}}><i className="fa fa-qrcode" aria-hidden="true"></i>Share</button></a>
                        <a href="#candidate-section"><button onClick={() => {props.selectExam(exam.id); props.showAddModule(false); props.showEditModule(false); props.clearFields();}}><i className="fa fa-users" aria-hidden="true"></i>Candidates</button></a>
                        <a href="#result-section"><button onClick={() => {props.selectExam(exam.id); props.shareExam(exam.id); props.showAddModule(false); props.showEditModule(false); props.clearFields();}}><i className="fa fa-tasks" aria-hidden="true"></i>Results</button></a>
                        <button className='danger' onClick={() => {props.removeExam(exam.id); props.showAddModule(false); props.showEditModule(false); props.clearFields();}}><i className="fa fa-trash-o" aria-hidden="true"></i>Delete</button>
                       </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Exams;

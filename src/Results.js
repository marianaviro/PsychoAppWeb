import React from 'react';
import './Results.css';

const Results = (props) => {
  console.log(props.currentExamId);
  return (
    <div>
      <div className = 'container test'>
        <h2>Results</h2>
        {props.currentExamId ?
          <div>
            <section className='edit-test'>
            {props.showEditScore ?
              <div>
                <form onSubmit={props.handleEdit}>
                <p>Score:</p>
                <input required="required" type="number" step="1" min="0" max="100" name="score" onChange={props.handleChange} value={props.score} />

                <p>Comments:</p>
                <textarea rows="3" maxLength="500" required="required" type="text" name="comments" placeholder="Enter an explanation for this score" onChange={props.handleChange} value={props.comments}/>

                  {props.editButton ?
                    <button className='success'><i className="fa fa-check-circle" aria-hidden="true"></i>Accept</button>
                    :
                    <button className='success' disabled><i className="fa fa-check-circle" aria-hidden="true"></i>Accept</button>
                  }
                  <button type="button" className='warning' onClick = {() => {props.showEditModule(false); props.clearFields()}}><i className="fa fa-times-circle" aria-hidden="true"></i>Cancel</button>
                </form>
              </div>
              :
              <div></div>
            }
            </section>

            <section className = 'display-test'>
              <div className="wrapper display">
                <ul>
                  {props.results.map((result) => {
                    let test_id = props.currentExamId + '-' + result.testId + '-' + result.candidateId;
                    var question = '';
                    let tests = props.tests;
                    for(var i = 0; i < props.tests.length; i++) {
                      if(tests[i].id === result.testId) {
                        question = tests[i].instructions;
                      }
                    }
                    var selected = '';
                    if(result === props.currentResult) {
                      selected = 'selected';
                    }

                    return (
                      <li className={selected} key={test_id}>
                        <h3>{result.exam.name}</h3>
                        <div>
                          <div className='test-info'>
                            <p><b>Candidate:</b> {result.candidate.name}</p>
                            <p><b>Question:</b></p>
                            <textarea rows="1" cols="50" value={question} readOnly></textarea>
                            <p><b>Answer:</b></p>
                            <textarea rows="1" cols="50" value={result.test.answer} readOnly></textarea>
                            {result.test.pending ?
                              <p><b>Score:</b> Not graded yet.</p>
                              :
                              <p><b>Score:</b> {result.test.score}</p>
                            }
                            {result.test.pending ?
                              <p><b>Comments:</b> Not graded yet.</p>
                              :
                              <p><b>Comments:</b> {result.test.comments}</p>
                            }
                          </div>
                          <div className='test-actions'>
                            {result.test.pending ?
                              <button className='danger results' onClick={() => props.editScore(result)}><i className="fa fa-check-circle-o" aria-hidden="true"></i>Assign score</button>
                              :
                              <button className='results' onClick={() => props.editScore(result)}><i className="fa fa-pencil" aria-hidden="true"></i>Edit score</button>
                            }
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>
          </div>
          :
          <p>Please select an exam.</p>
        }
      </div>
    </div>
  );
};

export default Results;

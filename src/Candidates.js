import React from 'react';
import './Candidates.css';

const Candidates = (props) => {
  console.log(props.currentExamId);
  console.log("Candidates in container: ", props.candidates);
  return (
    <div>
      <div className = 'container test'>
        <h2>Candidates</h2>
        {props.currentExamId ?
          <div>
            <section className = 'display-candidate'>
              <div className="wrapper display">
                <ul>
                  {props.candidates.map((candidate) => {
                    let candidate_id = props.currentExamId + '-' + candidate.candidateId;
                    return (
                      <li key={candidate_id}>
                        <h3>{candidate.candidate.name}</h3>
                        <div>
                          <div className='candidate-info'>
                            <p><b>Birth date:</b> {candidate.candidate.birthDay}</p>
                            <p><b>Email:</b> {candidate.candidate.email}</p>
                          </div>
                          <div className='candidate-actions'>
                          {candidate.candidate.idPicture ?
                            <a href={candidate.candidate.idPicture} target="_blank"><button className="candidates"><i className="fa fa-id-card-o" aria-hidden="true"></i>Photo ID</button></a>
                            :
                            <button className="candidates disabled"><i className="fa fa-id-card-o" aria-hidden="true" disabled></i>Photo ID</button>
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

export default Candidates;

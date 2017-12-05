import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import Exams from './Exams';
import Tests from './Tests';
import Results from './Results';
import Candidates from './Candidates';
import Logo from './logo.svg';
import Fondo from './landing.jpeg';
import QRCode from 'qrcode';

class App extends Component {

  constructor() {
    super();
    this.state = {
      newTitle: '',
      company: '',
      description: '',
      currentExamId: '',
      exams: [],
      tests: [],
      testTypes: [],
      google_user: null,
      user: null,
      showAddExam: false,
      showEditExam: false,
      showQRCode: false,
      qrCode:'',
      acceptButton: false,
      editButton: true,
      currentTestId: '',
      instructions: '',
      weight: null,
      time: null,
      maxValue: null,
      showAddTest: false,
      showEditTest: false,
      testAcceptButton: false,
      testEditButton: true,
      currentTypeId: '',
      allTestTypes: [],
      results: [],
      candidates: [],
      showEditScore: false,
      score: null,
      currentResult: null,
      comments: '',
      scoreAcceptButton: false,
      scoreEditButton: true
    }

    this.showAddExamModule = this.showAddExamModule.bind(this);
    this.showEditExamModule = this.showEditExamModule.bind(this);
    this.showQRCodeModule = this.showQRCodeModule.bind(this);
    this.enableAccept = this.enableAccept.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitExam = this.handleSubmitExam.bind(this);
    this.handleEditExam = this.handleEditExam.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.selectExam = this.selectExam.bind(this);
    this.removeExam = this.removeExam.bind(this);
    this.editExam = this.editExam.bind(this);
    this.shareExam = this.shareExam.bind(this);

    this.testShowAddModule = this.testShowAddModule.bind(this);
    this.testShowEditModule = this.testShowEditModule.bind(this);
    this.testEnableAccept = this.testEnableAccept.bind(this);
    this.handleSubmitTest = this.handleSubmitTest.bind(this);
    this.handleEditTest = this.handleEditTest.bind(this);
    this.editTest = this.editTest.bind(this);
    this.removeTest = this.removeTest.bind(this);
    this.testClearFields = this.testClearFields.bind(this);

    this.scoreShowEditModule = this.scoreShowEditModule.bind(this);
    this.handleEditScore = this.handleEditScore.bind(this);
    this.scoreEnableAccept = this.scoreEnableAccept.bind(this);
    this.editScore = this.editScore.bind(this);
    this.scoreClearFields = this.scoreClearFields.bind(this);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    if( this.state.newTitle !== '' && this.state.company !== '' && this.state.description !== '' ) {
      this.setState({
        acceptButton: true,
        editButton: true
      });
    } else {
      this.setState({
        acceptButton: false,
        editButton: false
      });
    }

    if( this.state.instructions !== '' && this.state.weight && this.state.time && this.state.maxValue ) {
      this.setState({
        testAcceptButton: true,
        testEditButton: true
      });
    } else {
      this.setState({
        testAcceptButton: false,
        testEditButton: false
      });
    }

    if( this.state.comments !== '' && this.state.score !== '-1' && this.state.score ) {
      this.setState({
        scoreAcceptButton: true,
        scoreEditButton: true
      });
    } else {
      this.setState({
        scoreAcceptButton: false,
        scoreEditButton: false
      });
    }
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          google_user: null,
          user: null
        });
      });
  }

  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const google_user = result.user;
        this.setState({
          google_user
        });
      });
  }

  handleSubmitExam(e) {
    e.preventDefault();

    //Add to exams table
    const examsRef = firebase.database().ref('exams');
    var usr = Object.values(this.state.user)[0];
    var usr_id = Object.keys(this.state.user)[0];

    const exam = {
      title: this.state.newTitle,
      user: usr_id,
      username: usr.name,
      description: this.state.description,
      company: this.state.company,
      tests: []
    }
    var examKey = examsRef.push(exam);
    console.log('Added exam: ' + examKey.key);

    //Add to user's exams array
    if(examKey) {
      const employerRef = firebase.database().ref(`/employers/${usr_id}/exams`);
      employerRef.child(`/${examKey.key}`).set(true);
    }
    this.setState({
      newTitle: '',
      company: '',
      description: '',
      showAddExam: false
    });
    this.shareExam(examKey.key);
  }

  handleSubmitTest(e) {
    e.preventDefault();

    const testsRef = firebase.database().ref(`/tests/${this.state.currentTypeId}`);
    testsRef.on('value', (snapshot) => {
      var idt = snapshot.key;
      var ce = this.state.currentExamId;
      const examTestRef = firebase.database().ref(`/exams/${ce}/tests/${idt}`);
      const test = {
        instructions: this.state.instructions,
        weight: parseFloat(this.state.weight),
        maxValue: parseInt(this.state.maxValue, 10),
        time: parseInt(this.state.time, 10)
      }
      console.log(test.weight);
      console.log(test.maxValue);
      console.log(test.time);
      var testKey = examTestRef.set(test);
      console.log('Added test: ' + testKey.key);

      this.setState({
        instructions: '',
        weight: null,
        maxValue: null,
        time: null,
        showAddTest: false,
        currentExamId: ce
      });
      console.log(idt);
    });
  }

  handleEditExam(e) {
    e.preventDefault();

    const examRef = firebase.database().ref(`/exams/${this.state.currentExamId}`);
    var usr_id = Object.keys(this.state.user)[0];
    var usr = Object.values(this.state.user)[0];

    const exam = {
      title: this.state.newTitle,
      user: usr_id,
      username: usr.name,
      description: this.state.description,
      company: this.state.company
    }
    var examKey = examRef.set(exam);
    console.log('Modified exam: ' + examKey.key);

    this.setState({
      currentExamId:'',
      newTitle: '',
      company: '',
      description: '',
      showEditExam: false
    });
  }

  handleEditTest(e) {
    e.preventDefault();

    var ce = this.state.currentExamId;
    const examTestRef = firebase.database().ref(`/exams/${ce}/tests/${this.state.currentTestId}`);
    const test = {
      instructions: this.state.instructions,
      weight: this.state.weight,
      maxValue: this.state.maxValue,
      time: this.state.time
    }
    var testKey = examTestRef.set(test);
    console.log('Modified test: ' + testKey.key);

    this.setState({
      instructions: '',
      weight: '',
      maxValue: '',
      time: '',
      showEditTest: false,
      currentExamId: ce
    });
  }

  handleEditScore(e) {
    e.preventDefault();

    var re = this.state.currentResult;
    const scoreRef = firebase.database().ref(`/candidates/${re.candidateId}/exams/${re.examId}/tests/${re.testId}/score`);
    const commentsRef = firebase.database().ref(`/candidates/${re.candidateId}/exams/${re.examId}/tests/${re.testId}/comments`);
    const pendingRef = firebase.database().ref(`/candidates/${re.candidateId}/exams/${re.examId}/tests/${re.testId}/pending`);

    var score = parseFloat(this.state.score);
    scoreRef.set(score);
    commentsRef.set(this.state.comments);
    pendingRef.set(false);
    console.log('Modified score and comments on test: ', re.testId);

    this.setState({
      score: '',
      comments: '',
      showEditScore: false,
      currentResult: null
    });
  }

  shareExam(examId) {
    if(examId) {
      var canvas = document.getElementById('canvas');
      QRCode.toCanvas(canvas, examId, { errorCorrectionLevel: 'H' }, function (error) {
        if (error) console.error(error)
        console.log('QR generated');
      });
    } else {
      document.getElementById('canvas').getContext("2d").clearRect(0, 0, 300, 300);
    }
  }

  selectExam(examId) {

    //Set current exam
    this.setState({
      currentExamId: examId,
      tests: []
    }, function() {
      this.shareExam(this.state.currentExamId);
      //Fetch Exam
      const examsRef = firebase.database().ref(`/exams/${examId}/tests`);
      examsRef.on('value', (snapshot) => {
        let examTests = snapshot.val();

        if(examTests) {
          var ets = Object.keys(examTests);
          var eis = Object.values(examTests);

          let newExamTests = [];
          for (var i = 0; i < ets.length; i++) {
            var vals = eis[i];
            var idtest = ets[i];
            newExamTests.push({
              id: idtest,
              maxValue: vals.maxValue,
              time: vals.time,
              weight: vals.weight,
              instructions: vals.instructions
            });
            console.log(newExamTests);
          }
          this.setState({
            testTypes: newExamTests
          }, function() {
            console.log(this.state.testTypes);
            let testSt = [];
            this.state.testTypes.forEach(function(x){
              const examTestsRef = firebase.database().ref(`/tests/${x.id}`);
              examTestsRef.on('value', (snapshot) => {

                let examt = snapshot.val();

                if(examt) {
                  testSt.push({
                    id: x.id,
                    weight: x.weight,
                    time: x.time,
                    maxValue: x.maxValue,
                    description: examt.description,
                    instructions: x.instructions,
                    name: examt.name,
                    privateId: examt.privateId
                  });
                  console.log(testSt);
                }
              });
            });
            console.log(testSt);
            this.setState({
              tests: testSt
            }, function() {

              var tResults = [];
              var tCandidates = [];

              console.log("Current exam ID: ", this.state.currentExamId);
              const examResultsRef = firebase.database().ref('candidates');
              examResultsRef.on('value', (snapshot) => {

                //Obtener todos los candidatos
                snapshot.forEach( (candidato) => {
                  const candidateRef = firebase.database().ref(`candidates/${candidato.key}/exams`);
                  candidateRef.orderByKey().equalTo(this.state.currentExamId).on('value', (snapshot) => {

                    //Obtener los candidatos que tienen el examen actual
                    snapshot.forEach( (examen) => {
                      console.log("Examen Value: ", examen.val());
                      console.log("Examen Key: ", examen.key);
                      console.log("Candidato Value: ", candidato.val());
                      console.log("Candidato Key: ", candidato.key);

                      var found = false;
                      for (var i = 0; i < tCandidates.length && !found; i++) {
                        if (tCandidates[i].candidateId === candidato.key) {
                          tCandidates[i].candidateId = candidato.key;
                          tCandidates[i].candidate = candidato.val();
                          found = true;
                        }
                      }
                      if(!found) {
                        tCandidates.push({
                          candidateId: candidato.key,
                          candidate: candidato.val()
                        })
                      }

                      const candidateTestsRef = firebase.database().ref(`candidates/${candidato.key}/exams/${examen.key}/tests`);
                      candidateTestsRef.orderByChild("privateId").equalTo("QUESTIONS").on('value', (snapshot) => {
                        snapshot.forEach( (test) => {
                          console.log("Test Value: ", test.val());
                          console.log("Test Key: ", test.key);

                          var match = false;
                          for (var i = 0; i < tResults.length && !match; i++) {
                            if (tResults[i].candidateId === candidato.key && tResults[i].testId === test.key && tResults[i].examId === examen.key) {
                              tResults[i].candidate = candidato.val();
                              tResults[i].exam = examen.val();
                              tResults[i].test = test.val();
                              match = true;
                            }
                          }
                          if(!match) {
                            tResults.push({
                              candidateId: candidato.key,
                              candidate: candidato.val(),
                              examId: examen.key,
                              exam: examen.val(),
                              testId: test.key,
                              test: test.val()
                            });
                            console.log("Results parciales: ", tResults);
                          }
                        });
                      });
                    });
                  });
                });
                this.setState({
                  results: tResults,
                  candidates: tCandidates
                }, function() {
                  console.log("State results: ", this.state.results);
                  console.log("State candidates: ", this.state.candidates);
                });
              });
            });
          });
        }
      });
    });
  }


  componentDidMount() {

    auth.onAuthStateChanged((g_user) => {
      if (g_user) {
        const employersRef = firebase.database().ref('employers');
        employersRef.orderByChild("google_uid").equalTo(g_user.uid).on('value', (snapshot) => {
          let emp = snapshot.val();

          //If it's a new employer
          if(!emp) {
            const newEmp = {
              google_uid: g_user.uid,
              name: g_user.displayName,
              email: g_user.email
            }
            var newEmpKey = employersRef.push(newEmp);
            employersRef.orderByKey().equalTo(newEmpKey.key).on('value', (snapshot) => {
              let eee = snapshot.val();
              this.setState({
                user: eee
              });
            });
            console.log("Se creo el usuario: ");
            console.log(this.state.user);
          }

          //If the employer was already in the db
          else {
            this.setState({
              user: emp
            });

            //Fetch exams
            const examsRef = firebase.database().ref('exams');
            examsRef.on('value', (snapshot) => {
              let exams = snapshot.val();
              let examsNewState = [];
              var usr_id = Object.keys(this.state.user)[0];
              for (let exam in exams) {
                if(exams[exam].user === usr_id){
                  examsNewState.push({
                    id: exam,
                    title: exams[exam].title,
                    user: exams[exam].user,
                    username: exams[exam].username,
                    description: exams[exam].description,
                    company: exams[exam].company
                  });
                }
              }
              this.setState({
                exams: examsNewState
              });
            });
          }

          const testTypesRef = firebase.database().ref('tests');
          testTypesRef.on('value', (snapshot) => {
            let types = snapshot.val();
            let typesNewState = [];
            if(types) {
              for(let type in types){
                typesNewState.push({
                  id: type,
                  name: types[type].name,
                  description: types[type].description,
                  privateId: types[type].privateId
                })
                console.log(typesNewState);
              }
              this.setState({
                allTestTypes: typesNewState,
                currentTypeId: typesNewState[0].id
              })
            }
            console.log(this.state.allTestTypes);
          })

        });
        this.setState({
          google_user: g_user
        });
      }
    });
  }

  removeExam(examId) {

    //Remove from exams table
    const examRef = firebase.database().ref(`/exams/${examId}`);
    examRef.remove();

    //Remove from users array
    var usr_id = Object.keys(this.state.user)[0];
    const userExamsReff = firebase.database().ref(`/employers/${usr_id}/exams/${examId}`);
    userExamsReff.remove();
    this.shareExam(null);
  }

  removeTest(testId) {
    var ce_id = this.state.currentExamId;
    const testRef = firebase.database().ref(`/exams/${ce_id}/tests/${testId}`);
    testRef.remove();
    this.selectExam(ce_id);
  }

  editExam(exam) {
    if(this.state.showAddExam) {
      this.setState({
        showAddExam: false
      });
    }
    var t = exam.title;
    var u = exam.username;
    var c = exam.company;
    var d = exam.description;
    this.setState({
      showEditExam: true,
      newTitle: t,
      currentExamId: exam.id,
      username: u,
      company: c,
      description: d
    });
    this.showEditExamModule(true);
    this.shareExam(this.state.currentExamId);
  }

  editTest(test) {
    if(this.state.showAddTest) {
      this.setState({
        showAddTest: false
      });
    }
    var i = test.instructions;
    var m = test.maxValue;
    var w = test.weight;
    var t = test.time;
    this.setState({
      showEditTest: true,
      instructions: i,
      currentTestId: test.id,
      weight: w,
      time: t,
      maxValue: m
    });
    this.testShowEditModule(true);
  }

  editScore(result) {
    var s = result.test.score;
    var c = result.test.comments;
    this.setState({
      showEditScore: true,
      score: s,
      currentResult: result,
      comments: c
    });
    this.scoreShowEditModule(true);
  }

  showAddExamModule(e) {
    this.setState({
      showAddExam: e,
      showEditExam: false
    });
    if(!e) {
      this.enableAccept(false);
    }
  }

  testShowAddModule(e) {
    this.setState({
      showAddTest: e,
      showEditTest: false
    });
    if(!e) {
      this.testEnableAccept(false);
    }
  }

  showEditExamModule(e) {
    this.setState({
      showEditExam: e,
      showAddExam: false
    });
    if(!e) {
      this.enableAccept(false);
    }
  }

  testShowEditModule(e) {
    this.setState({
      showEditTest: e,
      showAddTest: false
    });
    if(!e) {
      this.testEnableAccept(false);
    }
  }

  scoreShowEditModule(e) {
    this.setState({
      showEditScore: e
    });
    if(!e) {
      this.scoreEnableAccept(false);
      this.setState({
        currentResult: null
      });
    }
  }

  showQRCodeModule(e) {
    this.setState({
      showQRCode: e,
      showAddTest: false,
      showAddExam:false,
      showEditExam:false,
      showEditTest:false
    });
  }

  enableAccept(e) {
    this.setState({
      acceptButton: e
    });
  }

  testEnableAccept(e) {
    this.setState({
      testAcceptButton: e
    });
  }

  scoreEnableAccept(e) {
    this.setState({
      scoreAcceptButton: e
    });
  }

  enableEdit(e) {
    this.setState({
      editButton: e
    });
  }

  testEnableEdit(e) {
    this.setState({
      testEditButton: e
    });
  }

  scoreEnableEdit(e) {
    this.setState({
      scoreEditButton: e
    });
  }

  clearFields() {
    this.setState({
      newTitle: '',
      company: '',
      description: ''
    })
  }

  testClearFields() {
    this.setState({
      instructions: '',
      weight: null,
      time: null,
      maxValue: null,
      currentTestId: ''
    })
  }

  scoreClearFields() {
    this.setState({
      score: null,
      comments: ''
    })
  }

  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
            <img alt="PSYCHO" id = 'logo' src = {Logo}/>
              <h1>EMPLOYER DASHBOARD</h1>
              {this.state.google_user ?
                <button onClick={this.logout}><i className="fa fa-sign-out" aria-hidden="true"></i>Log Out</button>
                :
                <button onClick={this.login}><i className="fa fa-sign-in" aria-hidden="true"></i>Log In</button>
              }
            </div>
        </header>
        {this.state.google_user ?
          <div>
            <section className = 'exams'>
              <Exams clearFields={this.clearFields} editButton={this.state.editButton} enableEdit = {this.enableEdit} acceptButton = {this.state.acceptButton} enableAccept = {this.enableAccept} showAddExam = {this.state.showAddExam} showEditExam = {this.state.showEditExam} showAddModule = {this.showAddExamModule} showEditModule = {this.showEditExamModule} google_user = {this.state.google_user} user = {this.state.user} exams = {this.state.exams} newTitle = {this.state.newTitle} company = {this.state.company} description = {this.state.description} handleEdit = {this.handleEditExam} handleSubmit = {this.handleSubmitExam} handleChange = {this.handleChange} removeExam = {this.removeExam} selectExam = {this.selectExam} editExam = {this.editExam} shareExam = {this.shareExam} currentExamId = {this.state.currentExamId}/>
            </section>
            <section id = 'test-section' className = 'tests'>
              <Tests clearFields={this.testClearFields} editButton={this.state.testEditButton} enableEdit={this.testEnableEdit} acceptButton = {this.state.testAcceptButton} enableAccept = {this.testEnableAccept} showAddTest = {this.state.showAddTest} showEditTest = {this.state.showEditTest} showAddModule={this.testShowAddModule} showEditModule = {this.testShowEditModule} user = {this.state.user} currentExamId = {this.state.currentExamId} tests = {this.state.tests} handleSubmit = {this.handleSubmitTest} handleEdit = {this.handleEditTest} handleChange = {this.handleChange} editTest={this.editTest} removeTest = {this.removeTest} instructions={this.state.instructions} weight={this.state.weight} maxValue={this.state.maxValue} time={this.state.time} currentTypeId={this.state.currentTypeId} allTestTypes={this.state.allTestTypes} currentTestId = {this.state.currentTestId}/>
            </section>
            <section id = 'qr-section' className = 'qr'>
              <div className = 'container qr'>
                <h2>QR Code</h2>
                <canvas id="canvas"></canvas>
                <script src="bundle.js"></script>
              </div>
            </section>
            <section id = 'candidate-section' className = 'candidates'>
              <Candidates handleChange = {this.handleChange} currentExamId = {this.state.currentExamId} tests = {this.state.tests} candidates = {this.state.candidates}/>
            </section>
            <section id = 'result-section' className = 'results'>
              <Results currentResult = {this.state.currentResult} currentExamId = {this.state.currentExamId} tests = {this.state.tests} results = {this.state.results} clearFields={this.scoreClearFields} editButton={this.state.scoreEditButton} enableEdit = {this.scoreEnableEdit} acceptButton = {this.state.scoreAcceptButton} enableAccept = {this.scoreEnableAccept} handleEdit = {this.handleEditScore} handleChange = {this.handleChange} score={this.state.score} comments={this.state.comments} showEditScore = {this.state.showEditScore} showEditModule = {this.scoreShowEditModule} editScore={this.editScore}/>
            </section>
          </div>
          :
          <div className='wrapper landing'>
            <img alt='' src={Fondo}/>
          </div>
        }
      </div>
    );
  }

}
export default App;

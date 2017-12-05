import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import Exams from './Exams';
import Tests from './Tests';
import Logo from './logo.svg';
import Fondo from './landing.jpeg';

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
      currentTests: [],
      google_user: null,
      user: null,
      showAddExam: false,
      showEditExam: false,
      acceptButton: false,
      editButton: true
    }
    // this.componentDidMount = this.componentDidMount.bind(this);
    this.showAddExamModule = this.showAddExamModule.bind(this);
    this.showEditExamModule = this.showEditExamModule.bind(this);
    this.enableAccept = this.enableAccept.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitExam = this.handleSubmitExam.bind(this);
    this.handleEditExam = this.handleEditExam.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.selectExam = this.selectExam.bind(this);
    this.removeExam = this.removeExam.bind(this);
    this.editExam = this.editExam.bind(this);
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
    var usr_id = Object.keys(this.state.user)[0];
    var usr = Object.values(this.state.user)[0];
    const exam = {
      title: this.state.newTitle,
      user: usr_id,
      username: usr.name,
      description: this.state.description,
      company: this.state.company
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
    examRef.set(exam);
    // this.fetchExams();

    this.setState({
      currentExamId:'',
      newTitle: '',
      company: '',
      description: '',
      showEditExam: false
    });
  }

  selectExam(examId) {
    //Fetch Exam
    //Fetch exams
    // const examsRef = firebase.database().ref('exams');
    // let es = this.state.user.exams;
    // if(es) {
    //
    //   let examsNewState = [];
    //   for (let e in es) {
    //     examsRef.orderByKey().equalTo(e).on('value', (snapshot) => {
    //       let exam = snapshot.val();
    //       examsNewState.push({
    //         id: exam,
    //         title: exam.title,
    //         user: exam.user,
    //         tests: exam.tests,
    //         description: exam.description,
    //         company: exam.company
    //       });
    //     })
    //   }
    //   this.setState({
    //     exams: examsNewState
    //   });
    //
    // const examsRef = firebase.database().ref(`/exams/${examId}`);
    // examsRef.on('value', (snapshot) => {
    //   let exam = snapshot.val();
    //   let tests = exam.tests;
    //   let newState = [];
    //   for (let test in tests) {
    //     newState.push({
    //       id: test.llave
    //     });
    //   }
    //   this.setState({
    //     currentExamId: examId,
    //     currentTests: newState
    //   });
    // });
    //
    // //Fetch Tests
    // let tests = this.state.currentExam.;
    // for (let test in tests) {
    //   const testRef = firebase.database().ref(`/tests/${test.id}`);
    //   testRef.on('value', (snapshot) => {
    //     let t = snapshot.val();
    //
    //     new
    //   })
    // }
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
            employersRef.push(newEmp);
            this.setState({
              user: newEmp
            });
          }

          //If the employer was already in the db
          else {
            this.setState({
              user: emp
            });
            var usr_id = Object.keys(this.state.user)[0];
            const employerReff = firebase.database().ref(`/employers/${usr_id}/exams`);
            employerReff.on('value', (snapshot) => {
              let employerExams = snapshot.val();
              for(let employerExam in employerExams) {
                const examReff = firebase.database().ref('/exams');
                let employerExamsNewState = [];
                examReff.orderByKey().equalTo(employerExam).on('value', (snapshot) => {
                  let examDB = snapshot.val();
                  if(examDB) {
                    var exam_idd = Object.keys(examDB)[0];
                    var ex = Object.values(examDB)[0];

                    employerExamsNewState[exam_idd] = {
                      id: exam_idd,
                      title: ex.title,
                      description: ex.description,
                      user: ex.user,
                      username: ex.username,
                      company: ex.company
                    };
                    this.setState({
                      exams: employerExamsNewState
                    });
                  }
                })
              }
            });
          }
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

  showEditExamModule(e) {
    this.setState({
      showEditExam: e,
      showAddExam: false
    });
    if(!e) {
      this.enableAccept(false);
    }
  }

  enableAccept(e) {
    this.setState({
      acceptButton: e
    });
  }

  enableEdit(e) {
    this.setState({
      editButton: e
    });
  }

  clearFields() {
    this.setState({
      newTitle: '',
      company: '',
      description: ''
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
              <Exams exams = {this.state.exams} clearFields={this.clearFields} editButton={this.state.editButton} enableEdit = {this.enableEdit} acceptButton = {this.state.acceptButton} enableAccept = {this.enableAccept} showAddExam = {this.state.showAddExam} showEditExam = {this.state.showEditExam} showAddModule = {this.showAddExamModule} showEditModule = {this.showEditExamModule} google_user = {this.state.google_user} user = {this.state.user} newTitle = {this.state.newTitle} company = {this.state.company} description = {this.state.description} handleEdit = {this.handleEditExam} handleSubmit = {this.handleSubmitExam} handleChange = {this.handleChange} removeExam = {this.removeExam} selectExam = {this.selectExam} editExam = {this.editExam}/>
            </section>
            <section className = 'tests'>
              {this.state.currentExamId ?
                <Tests user = {this.state.user} currentExam = {this.state.currentExam} currentExamId = {this.state.currentExamId} currentTests = {this.state.currentTests} handleSubmit = {this.handleSubmitTest} handleChange = {this.handleChange} removeTest = {this.removeTest}/>
                :
                <p>Please select an exam.</p>
              }
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

import React,{Component} from 'react';
import MyCommonFunc from '../../globalfunctions.js';
import {NotificationContainer} from 'react-notifications';
import $ from 'jquery';
import moment from 'moment';
import Auth from '../../Auth';
import config from '../../config';
const baseUrl = config.baseUrl;

export default class ProfileInfo extends Component
{
  constructor(props){
    super(props);
    this.state = { 
      file:'',
      current_activity: '',
      imageUrl:require('../../assets/images/avatar.png'),
      email:'',
      mobile:'',
      title:'',
      description:'', 
      descErr:'',
      imageErr:'',
      name:'',
    };
     this.changeProfile =this.changeProfile.bind(this);
     this.handleChangeDesc=this.handleChangeDesc.bind(this);
     this.formSubmit =this.formSubmit.bind(this);
     this.getProfileInfo =this.getProfileInfo.bind(this);
     this.handleCurrentActivityChange =this.handleCurrentActivityChange.bind(this);
  }

  handleCurrentActivityChange(event){
    this.setState({current_activity:event.target.value});
  }
  async componentDidMount()
  {
    var current_user = await Auth.current_user()
    if (current_user) {
        var current_user_name = current_user.data.email.split('@')[0]
      if (current_user_name === this.props.uname) {
        this.setState({can_edit: true})
      }
      this.getProfileInfo();
    }
  }
  //GETTING PROFILE INFORMATION  
  getProfileInfo()
  {
    var uname = this.props.uname
    var data ={userid:localStorage.id, uname:uname};
    $.ajax({
      url:baseUrl+'getProfileInfo',
      method:'POST',
      data:{uname:this.props.uname},
      dataType:'JSON',
      success:function(response)
      {
        if(response.status === 200)
        {
          var profile_pic = response.data.pro_pic ? response.data.pro_pic : require('../../assets/images/avatar.png');
           this.setState({
             mobile:response.data.mobile,
             email:response.data.user_id.email,
             name:response.data.user_id.name,
             title:response.data.title.designation,
             description:response.data.description ? response.data.description :'A part of Nyros Technologies as a position ' + response.data.title.designation + ' since '+moment(response.data.doj).format('DD/MM/YYYY'),
             current_activity: response.data.current_activity ? response.data.current_activity : "Learning & growing all the time!",
             oldimageUrl:profile_pic,
             imageUrl:profile_pic,
           });
        }
        else
        {
         MyCommonFunc.createNotification('error','something went wrong'); 
        }
      }.bind(this),
      error:function(err)
      {
        console.log('getProfileInfo_err',err);
      }
    });
  }

  handleChangeDesc(event)
  {
    this.setState({description:event.target.value});
  }
  changeProfile(event)
  {
    let reader= new FileReader();
    let file= event.target.files[0];
    reader.onloadend= () => {
      this.setState({
        file: file,
        imageUrl: reader.result,
      })
    };
    reader.readAsDataURL(file);
    this.setState({userloader:true});
  }
  //SAVING PROFILE INFORMATION
  formSubmit(event)
  {
    var desc = this.state.description;
    var current_activity = this.state.current_activity;
    var image = this.state.imageUrl;
    var flag =1;
    if((desc === undefined) || (desc === ''))
    {
      this.setState({descErr:'This field is required',descEx:'only characters'});
      flag=0;
    }
    else if(desc.length > 1000)
    {
      this.setState({descErr:'Description should not be more than 1000 characters long'});
      flag=0;
    }
    else
    {
      this.setState({descErr:'',descEx:''});
    }
    if(current_activity && current_activity.length > 120)
    {
      this.setState({currentActivityErr:'Current Activity should not be more than 120 characters long'});
      flag =0
    }
    else
    {
      this.setState({currentActivityErr: ''});
    }
    if(flag === 1)
    {
      var profile_info ={"Authorization": localStorage.getItem('token'),userid:localStorage.id,desc:desc, current_activity:current_activity}
      $.ajax({
       url:baseUrl+'profile_save',
       method:'POST',
       dataType:'JSON',
       async: false,
       headers:profile_info,
       success:function(response)
       {
        this.setState({oldimageUrl:image})
        if(response.status === 200)
        {
          MyCommonFunc.createNotification('success',response.message);
          this.props.propic_update(this.state.imageUrl);            
        }
        else
        {
          MyCommonFunc.createNotification('error',response.message);  
        }
       }.bind(this),
       error:function(err)
       {
          console.log('err',err);
       }  

      }); 
    }
     event.preventDefault();
  }

  render(){

    return(
      <section className="my_prof_dtls">
          {/* profile block start */}
          <div className="col-md-3">
            <div className="my_pro_pic">
              <img alt='profile_pic' src={this.state.imageUrl ? this.state.imageUrl : require('../../assets/images/my_prof_pic.png') } />
            </div>
            <div className="pro_info">   
              <p>{this.state.title ? this.state.title :''}</p>
              <p><i className="glyphicon glyphicon-envelope"></i>{this.state.email}</p>
              <p><i className="glyphicon glyphicon-phone"></i>{this.state.mobile ? this.state.mobile :''}</p>
            </div>
          </div>
          <div className="col-md-9">
            {/* profile details content start */}
            <div className="prof_dtls_cntnt">
              <form>
                <div className="row">
                  <div className="col-md-12">
                    <p className='name'>{this.state.name ? this.state.name :''}</p>
                    <div className="form-group">
                      <label htmlFor="profName">Current Activity</label>
                      <div>
                        {this.state.can_edit ?
                          <div>
                            <input className="form-control" placeholder="Please enter your current Activity" value={this.state.current_activity} onChange={this.handleCurrentActivityChange}/>
                            <p className='error'>{this.state.currentActivityErr}</p>
                          </div>
                        :
                          <p>{this.state.current_activity}</p>
                        }
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="profDescription">About Me</label>
                      {this.state.can_edit ?
                        <div>
                          <textarea rows='6' className={this.state.descErr ? "inp_err form-control" : "form-control"} id="profDescription" placeholder="About me" value={this.state.description} onChange={this.handleChangeDesc}></textarea>
                          <p className='text-left err-label'>{this.state.descErr}</p>
                        </div>
                      :
                        <p>{this.state.description}</p>
                      }
                    </div>
                  </div>
                </div>
                {this.state.can_edit
                  ?
                  <button type="submit" onClick={this.formSubmit} className="btn btn-primary prof_save">Save</button>
                  :
                  ''
                }
              </form>
            </div>
            {/* profile details content end */}
          </div>
          <NotificationContainer/>
        {/* profile block end */}
      </section>
    )
  }
} 
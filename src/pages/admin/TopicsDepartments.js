import React, {useContext, useState, useEffect} from 'react'
import MainItem from '../../components/MainItem'
import LabeledInput from '../../components/UI/input/LabeledInput'
import './TopicsDepartments.css'
import StyledButton from '../../components/UI/button/StyledButton'
import {useNavigate} from 'react-router-dom'
import {UserContext} from '../../contexts/UserContext'
import {TopicsContext} from '../../contexts/TopicsContext'
import {DepartmentsContext} from '../../contexts/DepartmentsContext'


export default function TopicsDepartments() {

    const navigate = useNavigate()
    const {user, setUser} = useContext(UserContext);
    const {departments, setDepartments} = useContext(DepartmentsContext);
    const {topics, setTopics} = useContext(TopicsContext);

    const [currTopic, setCurrTopic] = useState({name: '', description: '', id:'', toAdd: true})
    const [currDepartment, setCurrDepartment] = useState({name: '', description: '', id:'', toAdd: true})

    const [media, setMedia] = useState({
        vertical: true,
        fontSize: ''
      });

    useEffect(()=>{ 
        setMedia({
          vertical: window.matchMedia("(max-width: 650px)").matches,
          fontSize: window.matchMedia("(max-width: 400px)").matches ? '' : 'small_font_size'
        })
        window
          .matchMedia("(max-width: 700px)")
          .addEventListener('change', e => setMedia({...media, vertical: e.matches}))
        
        window
          .matchMedia("(max-width: 400px)")
          .addEventListener('change', e => setMedia({...media, fontSize: e.matches ? 'small_font_size' : ''}))
    }, [])

  return (
    <div style = {{margin: 'auto'}}>
        <header>
            <StyledButton onClick={()=>navigate('/adminMeetups')} text='Meetups'/>
            <StyledButton onClick={()=>navigate('/login')} text='Log out'/>
        </header>

        <section style={media.vertical ? {display: 'block'} : {}}>
            <div className="left" style={media.vertical? {width: '100%'} : {}}>
                <h1>Add new topic</h1>

                <LabeledInput 
                    value={currTopic.name} 
                    onChange={e=>setCurrTopic({...currTopic, name: e.target.value})} 
                    label='name'
                />
                <LabeledInput 
                    value={currTopic.description} 
                    onChange={e=>setCurrTopic({...currTopic, description: e.target.value})}  
                    label='description'
                />
                <StyledButton 
                    margin='10px'
                    text = {currTopic.toAdd ? 'Add' : 'Update'} 
                    onClick={currTopic.toAdd ?
                        ()=>{setTopics([...topics, {...currTopic, id: (topics.length+1).toString()}]); console.log(topics)} 
                        :
                        ()=>setTopics(topics.map(topic =>{
                            if(topic.id === currTopic.id){
                                return currTopic
                            }
                            return topic
                        }))
                    }
                />

                
                {!currTopic.toAdd && 
                    <StyledButton 
                    margin='10px'
                    text='Back to adding' 
                    onClick={()=>setCurrTopic({name: '', description: '', id:'', toAdd: true})}
                    />
                }  

                <h2>All topics:</h2>

                {topics.map(topic=>
                    <MainItem 
                        titleName='topic name' 
                        title={topic.name} 
                        description={topic.description}
                        editHandler={()=>{
                            setCurrTopic({
                                name: topic.name,
                                description: topic.description, 
                                id: topic.id, 
                                toAdd: false
                            })
                        }}
                        deleteHandler={()=>setTopics(topics.filter(t=>t.id !== topic.id))}
                    />)}
            </div>
        
        
            <div className="right" style={media.vertical? {width: '100%'} : {}}>
                <h1>Add new department</h1>

                <LabeledInput 
                    value={currDepartment.name} 
                    onChange={e=>setCurrDepartment({...currDepartment, name: e.target.value})} 
                    label='name'
                /> 
                <LabeledInput 
                    value={currDepartment.description} 
                    onChange={e=>setCurrDepartment({...currDepartment, description: e.target.value})}  
                    label='description'
                />

                <StyledButton 
                    text = {currDepartment.toAdd ? 'Add' : 'Update'}
                    margin='10px'
                    onClick={currTopic.toAdd ?
                        ()=>setDepartments([...departments, {...currDepartment, id: (departments.length+1).toString()}])
                        :
                        ()=>setDepartments(departments.map(department=>{
                            if(department.id === currDepartment.id){
                                return currDepartment
                            }
                            return department
                        }))
                    }
                />

                {!currDepartment.toAdd && 
                    <StyledButton 
                    margin='10px'
                    text='Back to adding' 
                    onClick={()=>setCurrDepartment({name: '', description: '', id:'', toAdd: true})}
                    />
                }   

                <h2>All departments:</h2>
                
                {departments.map(department=>
                    <MainItem titleName='department name'
                        title={department.name} 
                        description={department.description} 
                        isLight={false}
                        editHandler={()=>{
                            setCurrDepartment({
                                name: department.name, 
                                description: department.description, 
                                id: department.id,
                                toAdd: false
                            })
                        }}
                        deleteHandler={() => setDepartments(departments.filter(d=>d.id !== department.id))}
                    />
                )}
            </div> 
        </section>
    </div>
  )
}

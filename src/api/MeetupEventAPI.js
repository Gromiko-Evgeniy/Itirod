export const getMeetupFromEvent = (event) => {
    let newMeetup = {
      id: event.id,
      title: event.summary,
      department: '',
      description: '',
      topic: '',
      start: (new Date(new Date(event.start.dateTime) - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 19),
      end: (new Date(new Date(event.end.dateTime) - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 19)
    }

    if(event.description !== undefined){
      newMeetup.topic = getInfoFromDescription('topic', event)
      newMeetup.department = getInfoFromDescription('department', event)
      newMeetup.description = getInfoFromDescription('description', event)
    }
    return newMeetup
}

export const groupDataInDescription = (meetup) => 
"topic:'" + meetup.topic + "'\n" +
"department:'" + meetup.department + "'\n" +
"description:'" + meetup.description + "'" 

export const getInfoFromDescription = (topic, event) => {
const infoIndex = event.description.indexOf(topic + ":'")+topic.length+2
const descAfterTopic = event.description.substring(infoIndex)
return descAfterTopic.substring(0, descAfterTopic.indexOf("'"))
}

export const formEventData = (meetup) => {
    return {
      id: meetup.id,
      title: meetup.title,
      description: groupDataInDescription(meetup),
      start: meetup.start,
      end: meetup.end
    }
}

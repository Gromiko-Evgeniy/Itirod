const CLIENT_ID = '70226555386-ial2ofdeca9qh4qehc5ilmkq2hkvmr5j.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBMoXXfYLR5FeOonALvHHoGpnmXIwMMJbc';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

let tokenClient;

export function Init() {
  window.gapi.load('client', async () => {
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
  });

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
}


export function Authenticate() {
  Init()
  tokenClient.callback = (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
  };

  if (window.gapi?.client?.getToken() === null) {
    tokenClient.requestAccessToken({prompt: 'consent'});
    console.log(window.gapi?.client?.getToken())
  } 
  else {
    tokenClient.requestAccessToken({prompt: ''});
  }
}

export const isAuthenticated = () => window.gapi.client.getToken() !== null
export const clientInited = () => window.gapi.client !== null && window.gapi.client !== undefined


export function Signout() {
  if (isAuthenticated()) {
    window.google.accounts.oauth2.revoke(window.gapi.client.getToken().access_token);
    window.gapi.client.setToken('');
  }
}

export const AuthenticateAndExecute = (callback) => {
  Authenticate() 
  // console.log("gapi.client")
  // console.log(window.gapi.client) //undefined

  var authenticateIntervalId = setInterval(
      () => {
        // console.log("gapi.client")
        // console.log(window.gapi.client) //ok почемуууууу???????
          if(isAuthenticated()){
            callback()              
            clearInterval(authenticateIntervalId);
          }
      },
      1000
  )
}

export async function GetEvents() {
  Init()

  let response;
  try {
    const request = {
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime',
    };
    response = await window.gapi.client.calendar.events.list(request);
  } catch (err) {
    console.log(err.message)
    return []
  }

  const events = response.result.items;
  if (!events || events.length === 0) {
    console.log('No events found.')
    return []
  }
  console.log('Events:')
  console.log(events)
  return events 
}

export function deleteEvent(id) {
  Init()
  // var params = {
  //   calendarId: 'primary',
  //   eventId: '34d90gb489osusn8ukbnsm73h0',
  // };

  // window.gapi.client.calendar.events.delete(params, function(err) {
  //   if (err) {
  //     console.log('The API returned an error: ' + err);
  //     return;
  //   }
  //   console.log('Event deleted.');
  // });

  window.gapi.client.load('calendar', 'v3', function() {
    var request = window.gapi.client.calendar.events.delete({
        'calendarId': 'primary',
        'eventId': id
    });
    
    request.execute(function(response) {
      if(response.error || response === false){
        console.log(response.error)
      }
    });
  })
}

export function createEvent(eventData) {
  Init()
  var event = {
    'summary': eventData.title,
    'description': eventData.description,
    'start': {
      'dateTime': eventData.start,
      'timeZone': 'Europe/Minsk'
    },
    'end': {
      'dateTime': eventData.end,
      'timeZone': 'Europe/Minsk'
    },
    'reminders': { 'useDefault': true }
  };

  window.gapi.client.load('calendar', 'v3', function() {

  var request = window.gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });

  request.execute(function(response) {
    if(response.error || response === false){
      console.log(response.error)
    }
  });
})}

export function updateEvent(eventData){
  Init()
  var event = {
    'summary': eventData.title,
    'description': eventData.description,
    'start': {
      'dateTime': eventData.start,
      'timeZone': 'Europe/Minsk'
    },
    'end': {
      'dateTime': eventData.end,
      'timeZone': 'Europe/Minsk'
    },
    'reminders': { 'useDefault': true }
  };

  window.gapi.client.load('calendar', 'v3', function() {

  var request = window.gapi.client.calendar.events.update({
    'calendarId': 'primary',
    'eventId':eventData.id,
    'resource': event
  });

  request.execute(function(response) {
    if(response.error || response === false){
      console.log(response.error)
    }
  });
})}

// export function updateEventDate(eventData){
//   Init()
//   var event = {
//     'start': {
//       'dateTime': eventData.start,
//       'timeZone': 'Europe/Minsk'
//     },
//     'end': {
//       'dateTime': eventData.end,
//       'timeZone': 'Europe/Minsk'
//     },
//     'reminders': { 'useDefault': true }
//   };
//   console.log(eventData)

//   window.gapi.client.load('calendar', 'v3', function() {

//   var request = window.gapi.client.calendar.events.update({
//     'calendarId': 'primary',
//     'eventId':eventData.id,
//     'resource': event
//   });

//   request.execute(function(response) {
//     if(response.error || response === false){
//       console.log(response.error)
//     }
//   });
// })}
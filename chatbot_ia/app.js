/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());


//esses dados vieram da inteligência artificial treinada, calma mentor, um dia virá da API
var previstos = ['2018/12/28, 07:27:24',
'2019/03/15, 17:38:32',
'2019/02/09, 09:34:32',
'2018/11/05, 19:00:44',
'2019/01/21, 17:57:28',
'2018/12/01, 12:07:28',
'2019/02/13, 23:50:52',
'2019/03/14, 01:31:12',
'2019/02/13, 02:36:44',
'2018/11/03, 13:24:56',
'2018/10/12, 01:24:32',
'2018/12/31, 03:21:20',
'2018/12/04, 21:21:00',
'2018/11/07, 06:38:36',
'2019/03/23, 15:43:36',
'2018/10/15, 14:42:40',
'2019/02/12, 16:20:28',
'2019/02/25, 02:47:20',
'2018/11/28, 13:56:36',
'2018/12/03, 14:04:04',
'2018/12/16, 22:06:16',
'2018/10/16, 17:37:48',
'2018/11/20, 19:28:40',
'2019/03/06, 09:56:48',
'2019/02/17, 19:28:44',
'2019/02/05, 13:46:36',
'2018/12/01, 22:25:56',
'2018/12/20, 12:24:52',
'2019/01/16, 04:50:08',
'2018/12/28, 10:26:52',
'2019/03/20, 21:19:04',
'2018/12/22, 17:06:32',
'2019/02/17, 15:49:44',
'2019/03/31, 20:13:12',
'2018/10/30, 04:38:36',
'2018/11/19, 01:05:00',
'2019/04/02, 02:44:20',
'2019/03/26, 05:48:08',
'2018/11/29, 15:10:44',
'2018/12/19, 13:12:00',
'2018/11/30, 11:57:16',
'2018/12/02, 23:31:00',
'2019/02/19, 04:09:08',
'2019/03/20, 12:02:16',
'2018/12/30, 23:05:24',
'2018/11/14, 14:09:36',
'2018/11/15, 22:35:52',
'2018/12/02, 06:48:16',
'2018/12/28, 02:32:20',
'2018/12/04, 02:01:24',
'2018/10/17, 15:41:08',
'2018/10/29, 17:58:48',
'2019/02/01, 12:13:40',
'2018/12/29, 15:01:20',
'2018/11/22, 11:58:32',
'2019/01/17, 18:24:52',
'2019/03/21, 06:35:12',
'2019/01/07, 23:21:36',
'2018/11/23, 06:53:28',
'2018/12/09, 22:38:28',
'2018/11/30, 08:00:44',
'2019/03/07, 23:53:40',
'2019/03/02, 16:13:40',
'2019/03/20, 04:32:32',
'2019/02/16, 08:32:12',
'2018/10/31, 16:46:08',
'2019/02/07, 22:54:08',
'2018/11/17, 16:09:28',
'2019/03/12, 07:54:20',
'2018/11/01, 20:45:44',
'2018/11/20, 04:17:16',
'2018/11/07, 03:36:44',
'2018/11/02, 13:58:00',
'2019/03/18, 05:43:52',
'2019/02/27, 14:27:24',
'2019/01/30, 22:24:28',
'2019/01/06, 23:05:08',
'2018/11/21, 08:43:16',
'2018/12/27, 07:47:40',
'2019/03/22, 15:47:36',
'2019/02/25, 16:17:08',
'2018/11/15, 20:07:16',
'2019/01/10, 04:01:48',
'2019/02/06, 03:48:48',
'2018/12/08, 10:43:56',
'2018/12/09, 22:59:20',
'2019/03/30, 14:59:00',
'2018/11/26, 04:25:12',
'2019/01/17, 00:26:28',
'2019/01/12, 20:40:32',
'2019/01/10, 22:12:32',
'2019/01/10, 17:45:48',
'2018/12/25, 02:40:12',
'2019/03/17, 02:47:00',
'2018/10/15, 01:09:48',
'2019/03/29, 09:21:52'];

const prev = {}
function to_split(data){
    prev[data.split(',')[0]] = data.split(',')[1]
    // etc.
  };
previstos.forEach(to_split);

var hora_real = ['2018/12/28, 06:00:00',
 '2019/03/15, 23:00:00',
 '2019/02/09, 01:12:00',
 '2018/11/05, 02:00:00',
 '2019/01/21, 22:00:00',
 '2018/11/30, 19:00:00',
 '2019/02/14, 03:30:00',
 '2019/03/14, 07:00:00',
 '2019/02/13, 07:00:00',
 '2018/11/02, 23:30:00',
 '2018/10/12, 02:30:00',
 '2018/12/30, 23:00:00',
 '2018/12/05, 01:00:00',
 '2018/11/07, 07:15:00',
 '2019/03/23, 07:40:00',
 '2018/10/15, 14:00:00',
 '2019/02/12, 23:00:00',
 '2019/02/24, 23:30:00',
 '2018/11/28, 18:00:00',
 '2018/12/02, 07:30:00',
 '2018/12/17, 02:30:00',
 '2018/10/16, 22:00:00',
 '2018/11/21, 01:00:00',
 '2019/03/06, 04:00:00',
 '2019/02/18, 01:00:00',
 '2019/02/05, 12:00:00',
 '2018/12/01, 21:00:00',
 '2018/12/20, 06:00:00',
 '2019/01/16, 12:00:00',
 '2018/12/28, 12:00:00',
 '2019/03/21, 02:00:00',
 '2018/12/22, 20:00:00',
 '2019/02/17, 18:20:00',
 '2019/03/29, 00:42:00',
 '2018/10/30, 07:00:00',
 '2018/11/19, 05:30:00',
 '2019/04/02, 04:30:00',
 '2019/03/26, 11:00:00',
 '2018/11/29, 09:00:00',
 '2018/12/19, 18:00:00',
 '2018/11/29, 11:00:00',
 '2018/12/03, 04:00:00',
 '2019/02/19, 03:00:00',
 '2019/03/20, 19:30:00',
 '2018/12/31, 03:00:00',
 '2018/11/14, 17:00:00',
 '2018/11/15, 19:42:00',
 '2018/12/02, 05:00:00',
 '2018/12/27, 13:18:00',
 '2018/12/03, 23:12:00',
 '2018/10/17, 19:15:00',
 '2018/10/29, 19:30:00',
 '2019/02/01, 16:00:00',
 '2018/12/29, 13:00:00',
 '2018/11/22, 13:30:00',
 '2019/01/18, 00:30:00',
 '2019/03/21, 07:36:00',
 '2019/01/08, 04:00:00',
 '2018/11/23, 05:00:00',
 '2018/12/09, 21:30:00',
 '2018/11/29, 14:30:00',
 '2019/03/06, 10:18:00',
 '2019/03/02, 11:20:00',
 '2019/03/20, 13:00:00',
 '2019/02/16, 00:18:00',
 '2018/10/31, 23:00:00',
 '2019/02/07, 16:00:00',
 '2018/11/17, 17:00:00',
 '2019/03/12, 12:00:00',
 '2018/11/01, 20:00:00',
 '2018/11/20, 06:00:00',
 '2018/11/07, 00:45:00',
 '2018/11/02, 12:00:00',
 '2019/03/18, 10:00:00',
 '2019/02/27, 20:00:00',
 '2019/01/30, 09:48:00',
 '2019/01/07, 04:30:00',
 '2018/11/21, 14:00:00',
 '2018/12/25, 08:00:00',
 '2019/03/22, 21:00:00',
 '2019/02/25, 02:54:00',
 '2018/11/15, 23:00:00',
 '2019/01/08, 12:58:00',
 '2019/02/06, 08:00:00',
 '2018/12/08, 09:30:00',
 '2018/12/10, 04:00:00',
 '2019/03/30, 11:24:00',
 '2018/11/26, 04:00:00',
 '2019/01/17, 05:00:00',
 '2019/01/12, 01:22:00',
 '2019/01/10, 23:12:00',
 '2019/01/11, 00:00:00',
 '2018/12/25, 06:00:00',
 '2019/03/17, 02:30:00',
 '2018/10/15, 04:00:00',
 '2019/03/29, 11:00:00'];

 const real = {}
 function to_split2(data){
   real[data.split(',')[0]] = data.split(',')[1]
     // etc.
   };
 hora_real.forEach(to_split2);

 console.log(real['2018/10/15'])

// Create the service wrapper
var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
   username: 'apikey',
   password: 'd8DP-U8WyNbm6Fb6wrgZGnBuwHLXmUlpxzoWyLgxFx_t',
  // url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: Conversation.VERSION_DATE_2017_04_21
});

// Endpoint to be call from the client side
app.post('/api/message', function(req, res) {
  // var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  var workspace = process.env.WORKSPACE_ID || '46b7099e-372f-456c-ac98-150587eba885';  
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }
  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {}
  };

  // Send the input to the conversation service
  conversation.message(payload, function(err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }

    var entitie;
    try{
      entitie = data.entities[0].value;
    }catch(e){
      entitie = undefined;
    }
    
    if(entitie !== undefined && entitie !== null ){
      entitie = entitie.replace(/-/g,'/')
      if(prev[entitie] !== undefined && prev[entitie] !== null){
        console.log("Nesta data ",prev[entitie], " e ele chegou de fato em ",real[entitie])
        data.output.text = ["Nesta data, prevejo uma chegada para "+ prev[entitie] +" e a chegada real foi às " + real[entitie]]
      }else{
        console.log("Eu ainda não tenho nenhum navio para esta data!")
      }
    }
    return res.json(updateMessage(payload, data));
  });
});

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */
function updateMessage(input, response) {
  var responseText = null;
  if (!response.output) {
    response.output = {};
  } else {
    return response;
  }
  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];
    // Depending on the confidence of the response the app can return different messages.
    // The confidence will vary depending on how well the system is trained. The service will always try to assign
    // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
    // user's intent . In these cases it is usually best to return a disambiguation message
    // ('I did not understand your intent, please rephrase your question', etc..)
    if (intent.confidence >= 0.75) {
      responseText = 'I understood your intent was ' + intent.intent;
    } else if (intent.confidence >= 0.5) {
      responseText = 'I think your intent was ' + intent.intent;
    } else {
      responseText = 'I did not understand your intent';
    }
  }
  response.output.text = responseText;
  return response;
}

module.exports = app;

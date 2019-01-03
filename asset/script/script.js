/*** /static/asset/script/schedule.js
***/


/*** Globals
***/

var gFirebaseDatabaseReference;
var gFirebaseDataSnapshot;
var gTimeoutMilliseconds = 1000;
var gTimeout;


/*** FUNCTION getFormData()
***/

getFormData = function() {
    var formDataA = $( '#admin-form' ).serializeArray();
    var formData = {};

    // convert from array to object
    formDataA.forEach(
        ( formDataElement , formDataIndex ) => {
            formData[ formDataElement.name ] = formDataElement.value;
        }
    );

    return formData;
}


/*** FUNCTION getNextTrainMoment()
***/

getNextTrainMoment = function( firstTrainTimeString , frequencyString ) {
    // parse strings
    var hoursMinutes = firstTrainTimeString.split( ':' );
    var hours = parseInt( hoursMinutes[ 0 ] );
    var minutes = parseInt( hoursMinutes[ 1 ] );
    var frequency = parseInt( frequencyString );

    // get times
    var currentMoment = moment();
    var firstTrainMoment = moment().startOf( 'day' ).add( hours , 'hours' ).add( minutes , 'minutes' );
    var nextTrainMoment = firstTrainMoment;
    while( ( nextTrainMoment.diff( currentMoment , 'minutes' ) - 1 ) < 0 ) {
        nextTrainMoment = nextTrainMoment.add( frequency , 'minutes' );
    }

    return nextTrainMoment;
}


/*** FUNCTION uiUpdateCurrentTime()
***/

uiUpdateCurrentTime = function() {
    $( '#time' ).text( `${ moment().format( 'YYYY-MO-DD HH:mm:ss' ) }` );
}


/*** FUNCTION uiNewSchedule()
***/

uiNewSchedule = function() {
    console.logValue( 'gFirebaseDataSnapshot' , gFirebaseDataSnapshot );

    // get table body (parent)
    var scheduleTableBodyJQ = $( '#schedule-table-body' );
    scheduleTableBodyJQ.empty();

    // create table rows
    Object.keys( gFirebaseDataSnapshot ).forEach(
        ( key , keyIndex ) => {
            var nextTrainMoment = getNextTrainMoment( gFirebaseDataSnapshot[ key ][ 'first-train-time' ] , gFirebaseDataSnapshot[ key ][ 'frequency' ] );
            var scheduleTableBodyRowJQ = $( '<tr>' ).attr( 'id' , `schedule-table-${ key }-row` );
            scheduleTableBodyRowJQ.append( $( '<td>' ).attr( 'id' , `schedule-table-${ key }-line-name` ).text( `${ gFirebaseDataSnapshot[ key ][ 'line-name' ] }` ) );
            scheduleTableBodyRowJQ.append( $( '<td>' ).attr( 'id' , `schedule-table-${ key }-destination` ).text( `${ gFirebaseDataSnapshot[ key ][ 'destination' ] }` ) );
            scheduleTableBodyRowJQ.append( $( '<td>' ).attr( 'id' , `schedule-table-${ key }-frequency` ).addClass( 'text-right' ).text( `${ gFirebaseDataSnapshot[ key ][ 'frequency' ] }` ) );
            scheduleTableBodyRowJQ.append( $( '<td>' ).attr( 'id' , `schedule-table-${ key }-next-train-time` ).addClass( 'text-right' ).text( `${ nextTrainMoment.format( 'HH:mm' ) }` ) );
            scheduleTableBodyRowJQ.append( $( '<td>' ).attr( 'id' , `schedule-table-${ key }-wait-time` ).addClass( 'text-right' ).text( `${ ( nextTrainMoment.diff( moment() , 'minutes' ) ) }` ) );
            scheduleTableBodyJQ.append( scheduleTableBodyRowJQ );
        }
    );
}






/*** FUNCTION uiUpdateSchedule()
***/

uiUpdateSchedule = function() {
    console.logValue( 'gFirebaseDataSnapshot' , gFirebaseDataSnapshot );

    // update table row
    Object.keys( gFirebaseDataSnapshot ).forEach(
        ( key , keyIndex ) => {
            var nextTrainMoment = getNextTrainMoment( gFirebaseDataSnapshot[ key ][ 'first-train-time' ] , gFirebaseDataSnapshot[ key ][ 'frequency' ] );
            $( `#schedule-table-${ key }-next-train-time` ).text( `${ nextTrainMoment.format( 'HH:mm' ) }` );
            $( `#schedule-table-${ key }-wait-time` ).text( `${ ( nextTrainMoment.diff( moment() , 'minutes' ) ) }` );
        }
    );
}




/*** FUNCTION firebaseInitialize()
***/

firebaseInitialize = function() {
    firebase.initializeApp(
        {
            apiKey : "AIzaSyDb9hbi8pzHzBgfbzMrhKN4Q1M_HuDS4EI" ,
            authDomain : "fsfp-homework-7.firebaseapp.com" ,
            databaseURL : "https://fsfp-homework-7.firebaseio.com" ,
            projectId : "fsfp-homework-7" ,
            storageBucket : "fsfp-homework-7.appspot.com" ,
            messagingSenderId : "895568434595"
        }
    );
}


/*** FUNCTION firebaseRegisterDatabase()
***/

firebaseRegisterDatabase = function() {
    gFirebaseDatabaseReference = firebase.database().ref( 'train-schedule' );
    gFirebaseDatabaseReference
    .on(
        'value' ,
        ( firebaseDataSnapshot ) => {
            gFirebaseDataSnapshot = firebaseDataSnapshot.toJSON();
            uiNewSchedule();
        }
    );
}


/*** FUNCTION firebaseAddLine()
***/

firebaseAddLine = function( formData ) {
    // get new child name in Firebase
    var childName = formData[ 'line-name' ].toLowerCase().replace( / /g , '-' );

    // create/update new Firebase child
    var childFirebaseDatabaseReference = gFirebaseDatabaseReference.child( childName );
    var promise = childFirebaseDatabaseReference.set( formData );

    // return promise
    return promise;
}


/*** FUNCTION handleTimeout()
***/

handleTimeout = function() {
    uiUpdateCurrentTime();

    // update only at the beginning of a minute
    if ( moment().seconds() === 0 ) {
        uiUpdateSchedule();
    }

    // restart timeout
    gTimeout = setTimeout( handleTimeout , gTimeoutMilliseconds );
}


/*** FUNCTION handleSubmit()
***/

handleSubmit = function( event ) {
    // set DOM event handling
    event.stopPropagation();
    event.preventDefault();

    // get form data
    var formData = getFormData();

    // add train line
    firebaseAddLine( formData )
    .then(
        () => {
            $( '#admin-form' ).trigger( 'reset' );
        }
    );
}


/*** FUNCTION handleReady()
***/

handleReady = function( event ) {
    uiUpdateCurrentTime();

    // initialize Firebase
    firebaseInitialize();
    firebaseRegisterDatabase();

    // register event handlers
    $( '#admin-form' ).on( 'submit' , handleSubmit );

    // start timeout
    gTimeout = setTimeout( handleTimeout , gTimeoutMilliseconds );
}


/*** Run
***/

$( handleReady );    // $( document ).ready( handleReady )

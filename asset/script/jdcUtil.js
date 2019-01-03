/*** jdcUtil.js
***/


/*** FUNCTION Array.equals()
***/

if ( Array.prototype.equals ) {
    console.warn( 'Overriding existing implementation of \'Array.prototype.equals()\'.' );
}
Array.prototype.equals = function( other ) {
    return (
        ( this.length === other.length ) &&
        this.every(
            ( element , index ) => {
                return element === other[ index ];
            }
        )
    )
}


/*** FUNCTION console.logValue()
***/

if ( console.logValue ) {
    console.warn( 'Overriding existing implementation of \'console.logValue()\'.' );
}
console.logValue = function( label , value ) {
    console.log( `${ label } :` , ( Object.prototype.toString.call( value ) ) , value );
    /*
    if ( typeof value === 'number' ) {
        console.groupCollapsed( `[${ ( typeof value ) }] ${ label }` );
        console.dir( value );
        console.groupEnd();
    }
    else if ( typeof value === 'boolean' ) {
        console.groupCollapsed( `[${ ( typeof value ) }] ${ label }` );
        console.dir( value );
        console.groupEnd();
    }
    else if ( typeof value === 'string' ) {
        console.groupCollapsed( `[${ ( typeof value ) }] ${ label }` );
        console.dir( value );
        console.groupEnd();
    }
    else if ( value === null ) {
        console.groupCollapsed( `[null] ${ label }` );
        console.dir( value );
        console.groupEnd();
    }
    else if ( value === undefined ) {
        console.groupCollapsed( `[undefined] ${ label }` );
        console.dir( value );
        console.groupEnd();
    }
    else {
        console.groupCollapsed( `${ Object.prototype.toString.call( value ) } ${ label }` );
        console.dir( value );
        console.groupEnd();
    }
    */
}


/*** CONSTRUCTOR JdcUtil()
***/

var JdcUtil = function() {
};


/*** FUNCTION randomNumber()
***/

JdcUtil.prototype.randomNumber = function( cardinality ) {
    // console.group( 'jdcUtil.randomNumber()' );
    // console.logValue( 'cardinality' , cardinality );

    // check cardinatliy
    if ( !cardinality ) {
        throw new RangeError( 'Parameter \'cardinality\' is required.' );
    }
    if ( cardinality < 1 ) {
        throw new RangeError( 'Parameter \'cardinality\' should be greater than 0.' )
    }

    var randomNumber = ( Math.floor( Math.random() * cardinality ) );
    return randomNumber;

    // console.logValue( 'cardinality' , cardinality );
    // console.groupEnd();
};


/*** FUNCTION randomNumbers()
***/
JdcUtil.prototype.randomNumbers = function( length , cardinality , flagUnique ) {
    // console.group( 'jdcUtil.randomNumbers()' );
    // console.logValue( 'cardinality' , cardinality  );
    // console.logValue( 'length' , length );
    // console.logValue( 'flagUnique' , flagUnique );

    // check cardinatliy
    if ( !cardinality ) {
        throw new RangeError( 'Parameter \'cardinality\' is required.' );
    }
    if ( cardinality < 1 ) {
        throw new RangeError( 'Parameter \'cardinality\' should be greater than 0.' )
    }
    if (
        ( flagUnique === true ) &&
        ( cardinality < length )
    ) {
        throw new RangeError( 'Parameter \'cardinality\' should be equal or greater than parameter \'length\'.' );
    }

    // default flagUnique
    flagUnique = ( ( flagUnique !== undefined ) && ( flagUnique === true ) );
    // console.logValue( 'flagUnique' , flagUnique );

    // check flagUnique
    if ( flagUnique === false ) {
        // allow duplicate numbers
        var randomNumbers = [];

        while ( randomNumbers.length < length ) {
            var randomNumber = this.randomNumber( cardinality );
            randomNumbers.push( randomNumber );
        }
    }
    else {
        // numbers should be unique
        var randomNumbers = [];
        var blackList = [];

        while ( randomNumbers.length < length ) {
            var randomNumber = this.randomNumber( cardinality );

            // ensure unique value
            while( blackList.indexOf( randomNumber ) > -1 ) {
                randomNumber++;
                // go "around the clock"
                if ( randomNumber === cardinality ) {
                    randomNumber = 0;
                }
            }

            randomNumbers.push( randomNumber );
            blackList.push( randomNumber );
        }
    }

    // console.logValue( 'randomNumbers' , randomNumbers );
    // console.groupEnd();
    return randomNumbers;
};

var jdcUtil = new JdcUtil();

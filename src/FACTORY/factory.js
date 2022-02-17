export default function Factory(){
    let subject=""
    let body="";
    let attachment=[]//{attachmentID:[],attachmnetMime:[],attachmentName:[],attachmentContent:[]}
    let Address={to:[],cc:[],bcc:[]} //To,CC,BCC
    let contactArray = []
    let contactnextLink="";
    let Message={
        subject,
        body,
        attachment,
        Address
    }

    return [
    //------------------------------------------START-----------------------------------------------------------

    //-----------------------------------------GETTERS----------------------------------------------------------
    function getSubject(){
        return subject;
    },
    function getBody(){
        return body;
    },
    function getAttachment(){
        return attachment;
    },
    function getAddress(){
        return Address;
    },
    function getMessage(){
        return Message;
    },
    function getContactArray(){
        return contactArray;
    },
    // function getContactLink(){
    //     return contactArray;
    // },

     //---------------------------------------SETTERS-----------------------------------------------------------
    function setSubject(Subject){
    subject=Subject
    },
    function setBody(Body){
    body=Body
    },
    function setAttachment(ID,MIME,NAME,CONTENT){
        
    attachment.push({
        id:ID,
        mimeType:MIME,
        filename:NAME,
        content:CONTENT
    }) 
    console.log(attachment);
    },
    function setAddress(type,email){
    if(type=="TO"){
        Address.to.push(email)
    }
    if(type=="CC"){
        Address.cc.push(email)
    }
    if(type=="BCC"){
        Address.bcc.push(email)
    }
    },
    function setContactArray(contact){
         contactArray.push(contact)
    },
    // function setContactLink(contact){
    //     contactnextLink=contact;
    // },
    //............................................REMOVER----------------------------------------------------------
    function removeAttachment(ID){
        let index=0;        
        // index=(attachment.id+"").indexOf(ID)
        for(let i=0;i<attachment.length;i++){
            if(attachment[i].id==ID){
                index=i;
            }
        }
        //console.log(attachment.id,ID)

        console.log(index) //-1
        
        attachment.splice(index,1)
        console.log(attachment);
    },
    function removeAddress(type,email){
        //console.log(type,email)
       let index;
        if(type=="TO"){
            index=Address.to.indexOf(email)
            //console.log(Address.to,email,index)
            Address.to.splice(index,1)
        }
        if(type=="CC"){
            index=Address.cc.indexOf(email)
            Address.cc.splice(index,1)
        }
        if(type=="BCC"){
            index=Address.bcc.indexOf(email)
            Address.bcc.splice(index,1)
        }  
    }

    
    //--------------------------------------------END----------------------------------------------------------
    ]
    }
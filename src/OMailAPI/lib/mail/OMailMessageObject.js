class OMailMessageObject {
  constructor(to, from, cc, bcc, subject, body, attachment, keyAttachment) {
    this.to = to; // [strings]
    this.from = from; // strings
    this.cc = cc; // [strings]
    this.bcc = bcc; // [strings]
    this.subject = subject; // string
    this.body = body; // string
    this.attachment = attachment; // [{id, filename, content}]
//    this.keyAttachment = keyAttachment;
  }
};

module.exports = OMailMessageObject;

class DocumentConnection {
  constructor(idConnectionDocuments, idDocument1, idDocument2, idConnection) {
    this.idConnectionDocuments = idConnectionDocuments; // id of the connection between documents
    this.idDocument1 = idDocument1;
    this.idDocument2 = idDocument2;
    this.idConnection = idConnection; // type of connection between the documents
  }
}

module.exports = DocumentConnection;

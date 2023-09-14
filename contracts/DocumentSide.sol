//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./UserSide.sol";

contract DocumentSide is UserSide{
    struct Document{
        string docTitle;
        string docSubject;
        string ipfsHash;
        uint256 uploadedBy;
        bool approval1;
        bool approval2;
        bool finalApproval;
        uint256 docOwner;
    }

    address public docAdmin;
    uint256 public docId = 0;
    mapping (uint256=>Document) public docIdtoDocument;
    mapping (uint256=> uint256[]) public docIdtoWitnessArray;
    mapping (uint256=> uint256[]) public docIdtoViewAccessArray;

    constructor(){
        userId++;
        docAdmin = msg.sender;
        createUser("System Admin", "ipfs.io/ipfs/QmSM8g2Mj3KYnrk2diaDCyMofucVojbtEGRHVKViZUU5RS", "4th Jan 1983",0xaE93A422CB100d43f0F6bc5F0a8322119FD74385, "112654", "384383833833", "ipfs.io/ipfs/Qmb78wwZ7Cd4XzcXGH8qMvQxPsimykhhJPZKGPpJDdTNkt", "Male", "kayalsoham61@gmail.com", 5);
        verifyUser(1);
    }
    

    // Normal users and unverfied users cannot upload
    function uploadDocument(string memory _docTitle,string memory _docSubject,string memory _ipfsHash,uint256 _userId,uint256[] memory _witnesses,uint256 _docOwner,uint256[] memory _viewAccess)public{
        User memory u1 = userIdtoUser[_userId];
        require(u1.role != 1,"Only Lawyers, Judge and Governmnet officials can upload documents");
        require(u1.isVerified == true,"Only Verified user can upload");
        Document memory d1 = Document(_docTitle,_docSubject,_ipfsHash,_userId,false,false,false,_docOwner);
        docIdtoWitnessArray[docId] = _witnesses;
        docIdtoViewAccessArray[docId] = _viewAccess;
        docIdtoDocument[docId] = d1;
        docId++; 
    }

    // checks if the userId exists in the witness list of the respective document and if exits it removes the witness from the list. Once the size of the witness list becomes 0, we can conclude that all the witnesses have approved. Once the witnesses approve approval1 (bool for witness approval) becomes true
    function markWitnessApproval(uint256 _userId,uint256 _docId)public{
        uint256 pos = 0;
        bool signal = false;
        for(uint256 i = 0;i < docIdtoWitnessArray[_docId].length;i++){
            if(_userId == docIdtoWitnessArray[_docId][i]){
                pos = i;
                signal = true;
            }
        }
        if(signal){
            docIdtoWitnessArray[_docId][pos] = docIdtoWitnessArray[_docId][docIdtoWitnessArray[_docId].length-1];
            docIdtoWitnessArray[_docId].pop();
            if(docIdtoWitnessArray[_docId].length == 0){
                docIdtoDocument[_docId].approval1 = true;
            }
        }
    }

    // userId -> 0 -> system admin
    function markNotaryApproval(uint256 _docId) public {
        Document memory d1 = docIdtoDocument[_docId];
        require(d1.approval1 , "The documents should be first approved by witnesses and other stakeholders");
        docIdtoDocument[_docId].approval2 = true;
        docIdtoDocument[_docId].docOwner = 0;
        docIdtoDocument[_docId].finalApproval = true;
    }      

    function manageViewAccess(string memory _email,uint256 _docId,uint256 signal1) public{
        if(signal1 == 1){
            // signal1 == 1 -> add user to view access array
            uint256 tempId = userEmailtoId[_email];
            require(checkUserRegistration(_email),"The user should be registered into the system");
            bool s1 = false;
            for(uint256 i = 0;i < docIdtoViewAccessArray[_docId].length;i++){
                if(tempId == docIdtoViewAccessArray[_docId][i]){
                    s1 = true;
                }
            }
            require(!s1,"User already has the view access");
            docIdtoViewAccessArray[_docId].push(tempId);
        }
        else{
            // signal1 == 0 -> remove user from view access array
            uint256 tempId = userEmailtoId[_email];
            bool s1 = false;
            uint256 pos = 0;
            for(uint256 i = 0;i < docIdtoViewAccessArray[_docId].length;i++){
                if(tempId == docIdtoViewAccessArray[_docId][i]){
                    s1 = true;
                    pos = i;
                    break;
                }
            }
            require(s1,"No user with access found to remove");
            docIdtoViewAccessArray[_docId][pos] = docIdtoViewAccessArray[_docId][docIdtoViewAccessArray[_docId].length-1];
            docIdtoViewAccessArray[_docId].pop(); 
        }
    }

    function checkUserRegistration(string memory _email) public view returns (bool) {
        if (keccak256(abi.encodePacked("kayalsoham61@gmail.com")) == keccak256(abi.encodePacked(_email))) return true;
        if(userEmailtoId[_email] != 0){
            return true;
        }   
        else{
            return false;
        }
    }
}
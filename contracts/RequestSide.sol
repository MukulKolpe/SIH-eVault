//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./DocumentSide.sol";
import "./UserSide.sol";

contract RequestSide is DocumentSide {
    struct Request{
        uint256 requestId;
        uint256 raisedBy;
        bool judgeApproval;
        uint256 requestedDocId;
        bool markDone;
    }

    uint256 public reqId = 0;
    mapping (uint256 => Request) public reqIdtoRequest;
    mapping (uint256 => uint256[]) public reqIdtoviewAccessList;
    mapping (uint256 => uint256[]) public reqIdtoRevokeViewAccessList;

    function createRequest(uint256 _docId,uint256 _raisedBy,uint256[] memory newAccessList,uint256[] memory revokeAccessList) public {
        uint256 tempRole = userIdtoUser[_raisedBy].role;
        require(tempRole >= 3,"Only Judges and Other Government Officials can raise a request");
        if(tempRole == 3){
            Request memory r1 = Request(reqId,_raisedBy,true,_docId,false);
            reqIdtoRequest[reqId] = r1;
            reqIdtoviewAccessList[reqId] = newAccessList;
            reqIdtoRevokeViewAccessList[reqId] = revokeAccessList;
            reqId++;
        }
        else{
            Request memory r1 = Request(reqId,_raisedBy,false,_docId,false);
            reqIdtoRequest[reqId] = r1;
            reqIdtoviewAccessList[reqId] = newAccessList;
            reqId++;
        }
    }

    function markJudgeApproval(uint256 _reqId) public {
        reqIdtoRequest[_reqId].judgeApproval = true;
    }

    function markRequestSatisfied(uint256 _reqId) public {
        reqIdtoRequest[_reqId].markDone = true;
    }

    // to get the length of viewAccess Array mapped to a request Id 
    function getRequestViewAccessArrayLength(uint256 _reqId) public view returns(uint256){
        return reqIdtoviewAccessList[_reqId].length;
    }
    
}
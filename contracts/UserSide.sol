//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract UserSide{

    //roles:- 
    // 1 : User (Normal)
    // 2 : Lawyer
    // 3 : Judge 
    // 4 : Other Government Officials
    // 5 : admin

    // approvals:- 
    // approval1 : witness and other stakeholders approval
    // approval2 : Notary public approval

    struct User {
        string name;
        string imageURL;
        string dob;
        address userAddress;
        string licenseNum;
        string aadharNum;
        string degreeURL;
        bool isVerified;
        string gender;
        string email;
        uint256 role;
    }

    address public admin;
    uint256 public userId = 0;
    mapping(uint256 => User) public userIdtoUser;
    mapping(string => address) public userEmailtoAddress;
    mapping(address => User) public userAddresstoUser;
    mapping(string => uint256) public userEmailtoId;
    mapping(address => uint256) public userAddresstoId;

    constructor(){
        admin = msg.sender;
    }

    function createUser (string memory _name,string memory _imageURL,string memory _dob,address _userAddress,string memory _licenseNum,string memory _aadharNum,string memory _degreeURL,string memory _gender,string memory _email,uint256 _role) public {
        User memory u1 = User(_name,_imageURL,_dob,_userAddress,_licenseNum,_aadharNum,_degreeURL,false,_gender,_email,_role);
        userIdtoUser[userId] = u1;
        userEmailtoAddress[_email] = _userAddress;
        userAddresstoUser[_userAddress] = u1;
        userEmailtoId[_email] = userId;
        userAddresstoId[_userAddress] = userId;
        userId++;
    }

    function verifyUser (uint256 _userId) public {
        require((msg.sender == admin || msg.sender == 0x12d0Ad7d21bdbe7E05AB0aDd973C58fB48b52Ae5 || msg.sender == 0xc35fC43ae078961BfC34FfB6c2148571b6f87920) ,"Only admin can access this function");
        userIdtoUser[_userId].isVerified = true;
    } 
}
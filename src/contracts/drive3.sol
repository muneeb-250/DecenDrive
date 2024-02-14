// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Drive {
    struct Access {
        address user;
        bool access;
    }
    mapping(address => Access[]) accessList;
    mapping(address => string[]) value; //urls of images on pinata to pin
    mapping(address => mapping(address => bool)) ownership;
    mapping(address => mapping(address => bool)) previousData;

    function add(address _user, string calldata _url) external {
        value[_user].push(_url);
    }

    function allow(address _user) external {
        ownership[msg.sender][_user] = true;

        if (previousData[msg.sender][_user] == true) {
            for (uint256 i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == _user) {
                    accessList[msg.sender][i].access = true;
                }
            }
        } else {
            accessList[msg.sender].push(Access(_user, true));
            previousData[msg.sender][_user] = true;
        }
    }

    function disallow(address _user) external {
        ownership[msg.sender][_user] = false;
        for (uint256 i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == _user) {
                accessList[msg.sender][i].access = false;
            }
        }
    }

    function display(address _user) external view returns (string[] memory) {
        require(
            _user == msg.sender || ownership[_user][msg.sender],
            "you don't have access!"
        );
        return value[_user];
    }

    function shareAccess() public view returns (Access[] memory) {
        return accessList[msg.sender];
    }
}

pragma solidity ^0.4.17;

contract ForumFactory{

    address[] private deployedQuestions;
    struct Forum{
        address deployedQuestions;
        string title;
    }
    Forum[] public forum;

    function createQuestion(uint minimum, string _title, string description, bool complete) public{
        address newQuestion = new Question(minimum, msg.sender, _title, description, complete);
        deployedQuestions.push(newQuestion);

        Forum memory newForum = Forum({
            deployedQuestions : newQuestion,
            title: _title
            });
        forum.push(newForum);
    }

    function getForumCount() public view returns(uint){
        return forum.length;
    }

    function getDeployedQuestions() public view returns (address[]) {
        return deployedQuestions;
    }
}

contract Question{
    address public manager;
    uint public value;
    string public title;
    string public description;
    bool public complete;

    struct Answer{
        address responder;
        string description;
        uint voteCount;
        mapping(address=>bool) voters;
    }
    Answer[] public answers;

    function Question(uint _value, address creator, string _title, string _description, bool _complete) public{
        manager = creator;
        value = _value;
        title = _title;
        description = _description;
        complete = _complete;
    }

    function postAnswer(string _description) public {
        address _responder = msg.sender;
        Answer memory newAnswer = Answer({
            responder : _responder,
            description : _description,
            voteCount:0
            });
        answers.push(newAnswer);
    }

    function vote(uint256 index) public{
        Answer storage ans = answers[index];
        require (msg.sender != manager);
        require (!ans.voters[msg.sender]);

        ans.voters[msg.sender] = true;
        ans.voteCount++;
    }

    function getQuestionDetails() public view returns(uint, string, string) {
        return(value, title, description);
    }

    function getAnswerCount() public view returns(uint) {
        return answers.length;
    }

    function finalizeAnswer(uint256 index) public payable returns (uint) {
        require(msg.sender == manager);
        require(msg.value > value);
        require(complete == false);
        Answer storage answer = answers[index];
        transferBalance(answer.responder, value);
        complete = true;
    }

    function getBalance() public view returns(uint256){
        return this.balance;
    }

    function transferBalance(address recepient, uint256 transferValue) public {
        require(this.balance > transferValue);
        recepient.transfer(transferValue);
    }

}
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const NewThread = require("../../Domains/threads/entities/NewThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread(useCasePayload);
    const addThread = await this._threadRepository.addThread(newThread);

    return new AddedThread(addThread);
  }
}

module.exports = AddThreadUseCase;

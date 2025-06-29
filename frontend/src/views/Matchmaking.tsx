import { RequestRoom } from "../Client";

export function Matchmaking() {
    return (
        <form className="matchmaking-form"
            onSubmit={(e) => {
                e.preventDefault();
                ///@ts-expect-error
                let matchType = e.target.matchType.value;
                ///@ts-expect-error
                let roomNumber = e.target.roomNumber.value;

                RequestRoom(matchType, roomNumber);
            }}
        >
            <div className="radio-group">
                <label>
                    <input type="radio" name="matchType" value="create" />
                    Create a new room
                </label>
                <br />
                <label>
                    <input type="radio" name="matchType" value="join" />
                    Join an existing room
                </label>
                <div className="room-input">
                    <input type="number" name="roomNumber" placeholder="Enter room number" />
                </div>
                <br />
                <label>
                    <input type="radio" name="matchType" value="auto" />
                    Automatic matchmaking
                </label>
            </div>
        </form>
    );
};

export default Matchmaking;
import { Client } from "../../client/model/Client";
import { Game } from "../../game/model/Game";

export interface Loan {
    id: number;
    game: Game;
    client: Client;
    loanDate: string;
    returnDate: string;
}

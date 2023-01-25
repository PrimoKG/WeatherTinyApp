import { useState } from "react"

//Exemple de mehdi non utilisé dans le projet
export const Coucou : React.FC = () => {

    const [value, setValue] = useState('');

    const set = (s: string) => {
        if (s.length > 5) {
            setValue(s);
        }
    }

    return (
        <div>
            <input onChange={(e) => set(e.target.value!)}>
                Coucou
            </input>
            <p>Bonsoir</p>
        </div>
    )
}
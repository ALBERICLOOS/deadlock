import {AbilityGuessResponse, DailyAbility, AbilityGuess, Hero, HeroDetail, HeroGuessResponse} from "../types/Types";
import React from "react";
import Box from "@mui/material/Box";
import SelectHero from "../components/SelectHero";
import TileContainer, {AbilityContainer, TileComponent} from "../components/Tile";
import {checkAndClearLocalStorage, fetchHeroes, LOCAL_STORAGE_KEY_ABILITIES} from "./Classic";

export default function Ability() {
    const [dailyAbility, setDailyAbility] = React.useState<DailyAbility | null>(null);
    const [heroes, setHeroes] = React.useState<Hero[]>([]);
    const [selectedHero, setSelectedHero] = React.useState<Hero | null>(null);
    const [guessedHeros, setGuessedHeros] = React.useState<AbilityGuess[]>([]);
    const [resetKey, setResetKey] = React.useState<string>('initial');  // Key to reset Autocomplete

    React.useEffect(() => {
        const fetchAndSetDailyAbility = async () => {

            const heroes = await fetchHeroes();
            setHeroes(heroes);

            checkAndClearLocalStorage(LOCAL_STORAGE_KEY_ABILITIES);
            const savedAbilities = localStorage.getItem(LOCAL_STORAGE_KEY_ABILITIES);
            if (savedAbilities) {
                const savedGuessedHeros = JSON.parse(savedAbilities);
                setGuessedHeros(savedGuessedHeros);

                // Filter out heroes that are already guessed
                const updatedHeroes = heroes.filter(hero =>
                    !savedGuessedHeros.some((guess: AbilityGuess) => guess.hero_id === hero.id)
                );
                setHeroes(updatedHeroes);
            }

            const dailyAbility = await fetchDailAbility();
            if (dailyAbility) {
                setDailyAbility(dailyAbility);
            }

        };
        fetchAndSetDailyAbility();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedHero){
            const [guess] = await Promise.all([
                submitGuess(selectedHero),
            ]);
            if (guess){
                setGuessedHeros(prevGuessedHeros => {
                    const updatedGuessedHeros = [{
                        ability: guess.ability,
                        hero_id: selectedHero.id,
                        hero_name: selectedHero.name,
                        image: selectedHero.image,
                    }, ...prevGuessedHeros];
                    localStorage.setItem(LOCAL_STORAGE_KEY_ABILITIES, JSON.stringify(updatedGuessedHeros));

                    return updatedGuessedHeros;
                });

                const deleteIndex = heroes.findIndex((hero) => hero.id === selectedHero.id);
                if (deleteIndex > -1) {
                    const newHeroes = [...heroes];
                    newHeroes.splice(deleteIndex, 1);
                    setHeroes(newHeroes);
                }

                setResetKey(Date.now().toString());  // Change the key to trigger re-render
                setSelectedHero(null);
                }
            }

    };



    return(
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            textAlign="center"
        >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="50vh" // Sets height to 30% of viewport height
                textAlign="center"
            >
                <h1>Ability</h1>
                <img
                    src={"data:image/jpeg;base64," + dailyAbility?.image_base64}
                    className="image-style"
                />
                <SelectHero heroes={heroes} handleSubmit={handleSubmit} setSelectedHero={setSelectedHero} resetKey={resetKey} />

            </Box>

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start" // Aligns items to the top
                alignItems="center" // Centers items horizontally
                flexGrow={1} // This will take up the remaining 70%
                textAlign="center"
            >
                {guessedHeros.map((guess, index) => (
                    <AbilityContainer key={guess.hero_id} image={guess.image} guess={guess.ability} name={guess.hero_name} guessCount={0} animate={index === 0} />
                ))}
            </Box>
        </Box>

)
}


async function fetchDailAbility(): Promise<DailyAbility | null> {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/daily/ability/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as DailyAbility;
    } catch (error) {
        console.error('Error fetching heroes:', error);
        return null;
    }
}

async function submitGuess(hero: Hero): Promise<AbilityGuessResponse | null> {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/guess/ability/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ hero_id: hero.id }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error submitting guess:', error);
        return null;
    }
}
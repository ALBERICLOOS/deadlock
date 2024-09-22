import {HeroGuess, Hero} from "../types/Types";
import React from "react";
import SelectHero from "../components/SelectHero";
import Box from "@mui/material/Box";
import TileContainer from "../components/Tile";
import {fetchHero, fetchHeroes, submitHeroGuess} from "../api/Api";
import {
    LOCAL_STORAGE_KEY_ABILITIES,
    LOCAL_STORAGE_KEY_DATE,
    LOCAL_STORAGE_KEY_HEROES,
    DEBUG,
    red,
    green, LOCAL_STORAGE_ABILITY_SUCCESS, LOCAL_STORAGE_HERO_SUCCESS
} from "../constants";
import SuccesScreen from "../components/SuccesScreen";
import Logo from "../components/Logo";
import Title from "../components/Title";


export function checkAndClearLocalStorage(key: string){
    const savedDate = localStorage.getItem(LOCAL_STORAGE_KEY_DATE);
    const currentDate = new Date().toISOString().split('T')[0];

    if (savedDate !== currentDate) {
        if (key === LOCAL_STORAGE_KEY_HEROES){
            localStorage.removeItem(LOCAL_STORAGE_KEY_HEROES);
        }
        else if (key === LOCAL_STORAGE_KEY_ABILITIES){
            localStorage.removeItem(LOCAL_STORAGE_KEY_ABILITIES);
        }
        localStorage.setItem(LOCAL_STORAGE_KEY_DATE, currentDate);
        localStorage.removeItem(LOCAL_STORAGE_ABILITY_SUCCESS)
        localStorage.removeItem(LOCAL_STORAGE_HERO_SUCCESS)
    }

    if (DEBUG) {
        localStorage.clear(); // Clear all local storage
    }
}

export default function Classic() {
    const [heroes, setHeroes] = React.useState<Hero[]>([]);
    const [selectedHero, setSelectedHero] = React.useState<Hero | null>(null);
    const [guessedHeros, setGuessedHeros] = React.useState<HeroGuess[]>([]);
    const [resetKey, setResetKey] = React.useState<string>('initial');  // Key to reset Autocomplete
    const [found, setFound] = React.useState<boolean>(false);


    React.useEffect(() => {
        const fetchAndSetHeroes = async () => {

            checkAndClearLocalStorage(LOCAL_STORAGE_KEY_HEROES);

            const heroes = await fetchHeroes();
            setHeroes(heroes);

            // Get saved heroes from local storage
            const savedHeroes = localStorage.getItem(LOCAL_STORAGE_KEY_HEROES);
            if (savedHeroes) {
                const savedGuessedHeros = JSON.parse(savedHeroes);
                setGuessedHeros(savedGuessedHeros);

                // Filter out heroes that are already guessed
                const updatedHeroes = heroes.filter(hero =>
                    !savedGuessedHeros.some((guess: HeroGuess) => guess.hero_id === hero.id)
                );
                setHeroes(updatedHeroes);
            }

            const success = localStorage.getItem(LOCAL_STORAGE_HERO_SUCCESS);
            if (success){
                setFound(true);
            }
        };

        fetchAndSetHeroes();
    }, []);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedHero) {
            const [guess, hero] = await Promise.all([
                submitHeroGuess(selectedHero),
                fetchHero(selectedHero.id)
            ]);

            if (guess && hero) {
                setGuessedHeros(prevGuessedHeros => {
                    const updatedGuessedHeros = [
                        {
                            hero_id: hero.id,
                            name: hero.name,
                            name_guess: guess.name,
                            image: hero.image,
                            gender: hero.gender,
                            gender_guess: guess.gender,
                            type: hero.type,
                            type_guess: guess.type,
                            release_year: hero.release_year,
                            release_year_guess: guess.release_year,
                            total_guesses: guess.total_guesses,
                        },
                        ...prevGuessedHeros
                    ];

                    localStorage.setItem(LOCAL_STORAGE_KEY_HEROES, JSON.stringify(updatedGuessedHeros));

                    if (updatedGuessedHeros.length > 0 && updatedGuessedHeros[0].name_guess) {
                        setFound(true);
                        localStorage.setItem(LOCAL_STORAGE_HERO_SUCCESS, "true");
                    }

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
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            textAlign="center"
        >
            <Box
                marginTop={7}
                marginBottom={5}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
            >
                <Logo/>
                <Title variant="h1">Classic</Title>
                {!found ?
                    <SelectHero heroes={heroes} handleSubmit={handleSubmit} setSelectedHero={setSelectedHero} resetKey={resetKey} />
                    :
                    <SuccesScreen found={found} />
                }
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start" // Aligns items to the top
                alignItems="center" // Centers items horizontally
                flexGrow={1} // This will take up the remaining 70%
                textAlign="center"
            >
                <TileContainer tiles={[
                    {label: "Hero", backgroundColor: "white", fontColor: "black"},
                    {label: "Name", backgroundColor: "white", fontColor: "black"},
                    {label: "Gender", backgroundColor: "white", fontColor: "black"},
                    {label: "Type", backgroundColor: "white", fontColor: "black"},
                    {label: "Release Year", backgroundColor: "white", fontColor: "black"},
                    {label: "Total Guesses", backgroundColor: "white", fontColor: "black"}
                ]}/>
                {guessedHeros.map((guess, index) => (
                    <TileContainer
                        key={guess.hero_id} // Use hero_id or another unique identifier as the key
                        tiles={[
                            { label: "", backgroundImage: guess.image },
                            { label: guess.name, backgroundColor: guess.name_guess ? green : red },
                            { label: guess.gender, backgroundColor: guess.gender_guess ? green : red },
                            { label: guess.type, backgroundColor: guess.type_guess ? green : red },
                            { label: guess.release_year.toString(), backgroundColor: guess.release_year_guess ? green : red },
                            { label: guess.total_guesses.toString(), backgroundColor: "white", fontColor: "black"},
                        ]}
                    />
                ))}
            </Box>
        </Box>

    );
}



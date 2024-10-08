import {AbilityGuessResponse, DailyAbility, Hero, HeroDetail, HeroGuessResponse} from "../types/Types";

const url = "https://deadlockle.com/api/"

export async function fetchHeroes(): Promise<Hero[]> {
    try {
        const response = await fetch(url + 'heroes/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Hero[];
    } catch (error) {
        console.error('Error fetching heroes:', error);
        return [];
    }
}

export async function submitAbilityGuess(hero: Hero): Promise<AbilityGuessResponse | null> {
    try {
        const response = await fetch(url + 'guess/ability/', {
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

export async function fetchDailAbility(): Promise<DailyAbility | null> {
    try {
        const response = await fetch(url + 'daily/ability/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as DailyAbility;
    } catch (error) {
        console.error('Error fetching heroes:', error);
        return null;
    }
}

export async function fetchHero(id: number): Promise<HeroDetail | null> {
    try {
        const response = await fetch(url + `heroes/${id}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as HeroDetail;
    } catch (error) {
        console.error('Error fetching heroes:', error);
        return null;
    }
}

export async function submitHeroGuess(hero: Hero): Promise<HeroGuessResponse | null> {
    try {
        const response = await fetch(url + 'guess/hero/', {
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


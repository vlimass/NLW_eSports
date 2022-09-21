import React, { useEffect, useState } from 'react';
import { FlatList, Image } from 'react-native';
import { styles } from './styles';
import logo from '../../assets/logo-nlw-esports.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Heading } from '../../components/Heading';
import { GameCard, GameCardProps } from '../../components/GameCard';
import { Background } from '../../components/Background';

export function Home() {
    const [games, setGames] = useState<GameCardProps[]>([]);
    const navigation = useNavigation();

    function handleOpenGame({ id, title, bannerUrl} : GameCardProps){
        navigation.navigate('game', { id, title, bannerUrl });
    }

    useEffect(() => {
        fetch('http://192.168.0.11:3333/games')
        .then(response => response.json())
        .then(data => { setGames(data); })
    }, []);

    return (
    <Background>
        <SafeAreaView style={styles.container}>
            <Image source={logo} style={styles.logo}/>

            <Heading 
                title='Encontre seu duo!'
                subtitle='Selecione o game que deseja jogar...'
            />

            <FlatList 
                data={games}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <GameCard 
                        data={item}
                        onPress={() => handleOpenGame(item)}
                    />
                )}
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={styles.contentlist}
            />
            
        </SafeAreaView>
    </Background>
    );
}

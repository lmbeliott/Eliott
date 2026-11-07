#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// sommes de tous les sous-ensembles : chaque nombre est pris ou non
vector<long long> toutes_les_sommes(const vector<long long>& nombres) {
    vector<long long> sommes = {0};
    for (long long x : nombres) {
        int taille = sommes.size();
        for (int i = 0; i < taille; i++) sommes.push_back(sommes[i] + x);
    }
    return sommes;
}

int main() {
    int n;
    cin >> n;
    vector<long long> nombres(n);
    long long total = 0;
    for (int i = 0; i < n; i++) {
        cin >> nombres[i];
        total += nombres[i];
    }

    vector<long long> gauche = toutes_les_sommes(vector<long long>(nombres.begin(), nombres.begin() + n / 2));
    vector<long long> droite = toutes_les_sommes(vector<long long>(nombres.begin() + n / 2, nombres.end()));
    sort(droite.begin(), droite.end());

    // un groupe de somme s donne la différence |total - 2s| : on veut s proche de total / 2
    long long meilleur = total;
    for (long long a : gauche) {
        // premier b avec 2 * (a + b) >= total, puis son voisin de gauche
        long long besoin = total - 2 * a;              // il faut 2 * b >= besoin
        long long seuil = besoin > 0 ? (besoin + 1) / 2 : 0;
        int i = lower_bound(droite.begin(), droite.end(), seuil) - droite.begin();
        if (i < (int)droite.size()) meilleur = min(meilleur, 2 * (a + droite[i]) - total);
        if (i > 0) meilleur = min(meilleur, total - 2 * (a + droite[i - 1]));
    }
    cout << meilleur << "\n";
    return 0;
}

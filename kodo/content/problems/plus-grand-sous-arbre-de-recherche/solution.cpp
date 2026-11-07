#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> cle(n + 1, 0);
    vector<int> gauche(n + 1), droite(n + 1);
    vector<bool> est_fils(n + 1, false);
    for (int i = 1; i <= n; i++) {
        cin >> cle[i] >> gauche[i] >> droite[i];
        est_fils[gauche[i]] = true;
        est_fils[droite[i]] = true;
    }
    int racine = 1;
    while (est_fils[racine]) racine++;
    // ordre en largeur : chaque père avant ses fils ; à l'envers, chaque fils avant son père
    vector<int> ordre;
    queue<int> file;
    file.push(racine);
    while (!file.empty()) {
        int v = file.front();
        file.pop();
        ordre.push_back(v);
        for (int f : {gauche[v], droite[v]})
            if (f != 0) file.push(f);
    }
    const long long INFINI = 2000000000LL;
    // pour chaque sous-arbre : est-ce un ABR ? sa taille, sa plus petite et sa plus grande clé
    vector<bool> abr(n + 1, true);            // l'indice 0 représente l'arbre vide
    vector<int> taille(n + 1, 0);
    vector<long long> mini(n + 1, INFINI), maxi(n + 1, -INFINI);
    int meilleur = 0;
    for (int k = n - 1; k >= 0; k--) {
        int v = ordre[k], g = gauche[v], d = droite[v];
        taille[v] = taille[g] + taille[d] + 1;
        mini[v] = min(mini[g], cle[v]);
        maxi[v] = max(maxi[d], cle[v]);
        abr[v] = abr[g] && abr[d] && maxi[g] < cle[v] && cle[v] < mini[d];
        if (abr[v]) meilleur = max(meilleur, taille[v]);
    }
    cout << meilleur << "\n";
    return 0;
}

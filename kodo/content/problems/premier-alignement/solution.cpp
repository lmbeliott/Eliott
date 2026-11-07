#include <iostream>
#include <vector>
using namespace std;

int main() {
    int h, w, k, m;
    cin >> h >> w >> k >> m;
    vector<int> coups(m);
    for (int i = 0; i < m; i++) {
        cin >> coups[i];
    }

    // grille[l][c] : 0 si la case est vide, sinon le numéro du joueur (1 ou 2).
    // La ligne 0 est en haut, la ligne h - 1 tout en bas.
    vector<vector<int>> grille(h, vector<int>(w, 0));
    // hauteur[c] : nombre de jetons déjà posés dans la colonne c.
    vector<int> hauteur(w, 0);

    // Les quatre directions d'alignement : horizontale, verticale, deux diagonales.
    int dirL[4] = {0, 1, 1, 1};
    int dirC[4] = {1, 0, 1, -1};

    int reponse = 0;
    for (int numero = 1; numero <= m && reponse == 0; numero++) {
        int joueur = (numero % 2 == 1) ? 1 : 2;
        int c = coups[numero - 1] - 1;
        int l = h - 1 - hauteur[c];   // le jeton tombe sur la plus basse case libre
        grille[l][c] = joueur;
        hauteur[c]++;

        // Seul le jeton qui vient d'être posé peut créer un nouvel alignement.
        for (int d = 0; d < 4; d++) {
            int nb = 1;
            // On compte les jetons du joueur dans un sens, puis dans l'autre.
            for (int sens = 1; sens >= -1; sens -= 2) {
                int i = l + sens * dirL[d];
                int j = c + sens * dirC[d];
                while (i >= 0 && i < h && j >= 0 && j < w && grille[i][j] == joueur) {
                    nb++;
                    i += sens * dirL[d];
                    j += sens * dirC[d];
                }
            }
            if (nb >= k) {
                reponse = numero;
            }
        }
    }

    cout << reponse << "\n";
    return 0;
}

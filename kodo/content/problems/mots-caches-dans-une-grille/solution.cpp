#include <iostream>
#include <string>
#include <vector>
#include <unordered_set>
using namespace std;

vector<int> DI = {-1, -1, -1, 0, 0, 1, 1, 1};   // les 8 directions
vector<int> DJ = {-1, 0, 1, -1, 1, -1, 0, 1};

void ajouter_lectures(const vector<string>& grille, int i, int j, int di, int dj,
                      unordered_set<string>& lisibles) {
    // ajoute tous les mots de 1 à 8 lettres lus depuis (i, j) dans la direction (di, dj)
    int r = grille.size();
    int c = grille[0].size();
    string mot = "";
    while (0 <= i && i < r && 0 <= j && j < c && mot.size() < 8) {
        mot += grille[i][j];
        lisibles.insert(mot);
        i = i + di;
        j = j + dj;
    }
}

int main() {
    int r, c;
    cin >> r >> c;
    vector<string> grille(r);
    for (int i = 0; i < r; i++) {
        cin >> grille[i];
    }

    unordered_set<string> lisibles;      // tous les mots que l'on peut lire dans la grille
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            for (int d = 0; d < 8; d++) {
                ajouter_lectures(grille, i, j, DI[d], DJ[d], lisibles);
            }
        }
    }

    int q;
    cin >> q;
    int trouves = 0;
    for (int k = 0; k < q; k++) {
        string mot;
        cin >> mot;
        if (lisibles.count(mot) > 0) {
            trouves = trouves + 1;
        }
    }
    cout << trouves << "\n";
    return 0;
}

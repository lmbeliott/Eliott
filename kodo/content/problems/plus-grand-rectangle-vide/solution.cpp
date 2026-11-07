#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int L, C;
    cin >> L >> C;
    vector<string> grille(L);
    for (int l = 0; l < L; l++) cin >> grille[l];

    vector<int> h(C + 1, 0);   // h[C] = 0 : colonne fictive qui vide la pile
    long long meilleur = 0;
    for (int l = 0; l < L; l++) {
        for (int c = 0; c < C; c++) {
            h[c] = (grille[l][c] == '.') ? h[c] + 1 : 0;
        }
        // plus grand rectangle sous l'histogramme h
        vector<int> pile;      // colonnes de hauteurs croissantes
        for (int c = 0; c <= C; c++) {
            while (!pile.empty() && h[pile.back()] >= h[c]) {
                int t = pile.back();
                pile.pop_back();
                int gauche = pile.empty() ? -1 : pile.back();
                meilleur = max(meilleur, (long long)h[t] * (c - gauche - 1));
            }
            pile.push_back(c);
        }
    }
    cout << meilleur << "\n";
    return 0;
}

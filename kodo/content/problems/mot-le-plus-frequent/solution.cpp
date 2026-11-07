#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<string> mots(n);
    for (int i = 0; i < n; i++) {
        cin >> mots[i];
    }

    unordered_map<string, int> compte;
    for (int i = 0; i < n; i++) {
        compte[mots[i]]++;          // une clé absente vaut 0 au départ
    }

    // on parcourt les mots dans l'ordre de l'entrée : en cas d'égalité,
    // le mot apparu en premier est rencontré en premier et reste le meilleur
    string meilleur = mots[0];
    for (int i = 0; i < n; i++) {
        if (compte[mots[i]] > compte[meilleur]) {
            meilleur = mots[i];
        }
    }
    cout << meilleur << " " << compte[meilleur] << "\n";
    return 0;
}

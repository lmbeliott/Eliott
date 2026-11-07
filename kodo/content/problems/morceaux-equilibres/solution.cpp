#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    string mot;
    cin >> mot;
    int n = mot.size();

    // solde = (voyelles - consonnes) parmi les premières lettres déjà lues.
    // Le morceau entre deux moments où le solde est le même est équilibré.
    // Le solde est entre -n et n : on le décale de n pour s'en servir comme indice.
    vector<int> premier(2 * n + 1, -1);   // premier moment où l'on a vu chaque solde
    vector<int> compte(2 * n + 1, 0);     // nombre de fois où l'on a vu chaque solde

    int solde = 0;
    premier[n] = 0;
    compte[n] = 1;
    int plus_long = 0;
    long long total = 0;
    string voyelles = "aeiouy";
    for (int i = 0; i < n; i++) {
        if (voyelles.find(mot[i]) != string::npos) {
            solde = solde + 1;
        } else {
            solde = solde - 1;
        }
        int k = solde + n;
        if (premier[k] == -1) {
            premier[k] = i + 1;
        } else {
            plus_long = max(plus_long, i + 1 - premier[k]);
        }
        // Chaque moment passé avec le même solde donne un morceau équilibré qui finit ici.
        total = total + compte[k];
        compte[k] = compte[k] + 1;
    }

    cout << plus_long << "\n" << total << "\n";
    return 0;
}

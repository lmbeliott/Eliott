#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int k;
    cin >> k;
    vector<int> pieces(k);
    for (int i = 0; i < k; i++) {
        cin >> pieces[i];
    }
    if (k <= 2) {
        cout << 0 << "\n";
        return 0;
    }
    int limite = pieces[k - 2] + pieces[k - 1];   // les montants à examiner sont < limite
    vector<int> glouton(limite, 0), opt(limite, 0);
    int j = 0;                                    // indice de la plus grande pièce <= s
    int reponse = 0;
    for (int s = 1; s < limite; s++) {
        while (j + 1 < k && pieces[j + 1] <= s) {
            j++;
        }
        glouton[s] = 1 + glouton[s - pieces[j]];
        int meilleur = s;
        for (int c : pieces) {
            if (c > s) {
                break;
            }
            meilleur = min(meilleur, opt[s - c]);
        }
        opt[s] = 1 + meilleur;
        if (glouton[s] > opt[s]) {
            reponse = s;
            break;
        }
    }
    cout << reponse << "\n";
    return 0;
}

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

const long long PLAFOND = 1000000000000000001LL;   // les longueurs plus grandes sont remplacées par ce plafond

string regle[2];                    // regle[0] pour a, regle[1] pour b
vector<vector<long long>> longueur, nb_b;

// nombre de b parmi les k premières lettres du mot obtenu depuis la lettre c en t étapes
long long compter(int t, int c, long long k) {
    if (k == 0) return 0;
    if (t == 0) return c == 1 ? 1 : 0;
    long long total = 0;
    for (char lettre : regle[c]) {
        int d = lettre - 'a';
        if (k >= longueur[t - 1][d]) {
            // le morceau issu de d est entièrement dans les k premières lettres
            total += nb_b[t - 1][d];
            k -= longueur[t - 1][d];
        } else {
            // le préfixe s'arrête au milieu de ce morceau : on descend dedans
            return total + compter(t - 1, d, k);
        }
    }
    return total;
}

int main() {
    int e, q;
    cin >> e >> q >> regle[0] >> regle[1];

    // longueur[t][c] et nb_b[t][c] : longueur et nombre de b du mot obtenu
    // en partant de la seule lettre c et en faisant t étapes
    longueur.assign(e + 1, vector<long long>(2, 0));
    nb_b.assign(e + 1, vector<long long>(2, 0));
    longueur[0][0] = longueur[0][1] = 1;
    nb_b[0][1] = 1;
    for (int t = 1; t <= e; t++) {
        for (int c = 0; c < 2; c++) {
            long long lg = 0, nb = 0;
            for (char lettre : regle[c]) {
                lg += longueur[t - 1][lettre - 'a'];
                nb += nb_b[t - 1][lettre - 'a'];
            }
            longueur[t][c] = min(PLAFOND, lg);
            nb_b[t][c] = min(PLAFOND, nb);
        }
    }

    for (int i = 0; i < q; i++) {
        long long k;
        cin >> k;
        cout << compter(e, 0, k) << "\n";
    }
    return 0;
}

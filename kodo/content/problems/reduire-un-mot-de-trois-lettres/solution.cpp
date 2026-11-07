#include <iostream>
#include <string>
using namespace std;

// longueur minimale après réductions, suivie de la lettre restante si elle vaut 1
string reduire(const string &mot) {
    int nb[3] = {0, 0, 0};
    for (char c : mot) {
        nb[c - 'a']++;
    }
    // une seule lettre différente : aucune opération possible
    if ((nb[0] == 0) + (nb[1] == 0) + (nb[2] == 0) == 2) {
        if (mot.size() == 1) {
            return "1 " + mot;
        }
        return to_string(mot.size());
    }
    int p[3] = {nb[0] % 2, nb[1] % 2, nb[2] % 2};
    if (p[0] == p[1] && p[1] == p[2]) {
        return "2";
    }
    // la lettre dont la parité diffère des deux autres est celle qui reste
    string reponse = "";
    for (int k = 0; k < 3; k++) {
        if (p[k] != p[(k + 1) % 3] && p[k] != p[(k + 2) % 3]) {
            reponse = string("1 ") + (char) ('a' + k);
        }
    }
    return reponse;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        string mot;
        cin >> mot;
        cout << reduire(mot) << "\n";
    }
    return 0;
}

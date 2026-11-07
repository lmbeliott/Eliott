#include <iostream>
#include <string>
using namespace std;

long long puissance(long long m, int e) {
    // m multiplié e fois par lui-même
    long long r = 1;
    for (int k = 0; k < e; k++) r *= m;
    return r;
}

long long compter(long long x, const string& autorises) {
    // Nombre d'entiers n tels que 1 ≤ n ≤ x, écrits seulement avec les chiffres autorisés.
    if (x == 0) return 0;
    string s = to_string(x);
    int longueur = s.size();
    int m = autorises.size();
    int non_nuls = 0;
    for (char c : autorises) {
        if (c != '0') non_nuls++;
    }

    long long total = 0;
    // Les nombres qui ont moins de chiffres que x : un premier chiffre non nul,
    // puis n'importe quel chiffre autorisé à chaque autre position.
    for (int l = 1; l < longueur; l++) {
        total += non_nuls * puissance(m, l - 1);
    }

    // Les nombres qui ont autant de chiffres que x : ils suivent x jusqu'à une position i,
    // puis y mettent un chiffre autorisé plus petit ; ensuite, tout est permis.
    for (int i = 0; i < longueur; i++) {
        int plus_petits = 0;
        for (char c : autorises) {
            if (c < s[i] && !(i == 0 && c == '0')) plus_petits++;
        }
        total += plus_petits * puissance(m, longueur - 1 - i);
        if (autorises.find(s[i]) == string::npos) {
            return total;    // x ne peut plus être suivi au-delà de cette position
        }
    }
    return total + 1;        // x lui-même est écrit avec les chiffres autorisés
}

int main() {
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string autorises;
        long long a, b;
        cin >> autorises >> a >> b;
        cout << compter(b, autorises) - compter(a - 1, autorises) << "\n";
    }
    return 0;
}

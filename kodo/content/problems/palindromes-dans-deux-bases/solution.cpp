#include <iostream>
#include <string>
#include <vector>
using namespace std;

// vrai si l'écriture de x en base b se lit pareil dans les deux sens
bool palindromeEnBase(long long x, int b) {
    vector<int> chiffres;
    while (x > 0) {
        chiffres.push_back(x % b);
        x = x / b;
    }
    int i = 0;
    int j = (int) chiffres.size() - 1;
    while (i < j) {
        if (chiffres[i] != chiffres[j]) {
            return false;
        }
        i++;
        j--;
    }
    return true;
}

// palindromes décimaux de cette longueur, au plus n, palindromes en base b
long long compterLongueur(int longueur, long long n, int b) {
    long long total = 0;
    int h = (longueur + 1) / 2;
    long long debut = 1;
    for (int k = 1; k < h; k++) {
        debut *= 10;
    }
    // on fabrique les palindromes à partir de leur première moitié, dans l'ordre croissant
    for (long long moitie = debut; moitie < debut * 10; moitie++) {
        string s = to_string(moitie);
        string p = s;
        int dernier = (longueur % 2 == 0) ? (int) s.size() - 1 : (int) s.size() - 2;
        for (int k = dernier; k >= 0; k--) {
            p += s[k];                   // abc -> abccba ou abcba
        }
        long long x = stoll(p);
        if (x > n) {
            return total;                // les suivants de cette longueur sont plus grands
        }
        if (palindromeEnBase(x, b)) {
            total++;
        }
    }
    return total;
}

int main() {
    long long n;
    int b;
    cin >> n >> b;
    long long total = 0;
    for (int longueur = 1; longueur <= (int) to_string(n).size(); longueur++) {
        total += compterLongueur(longueur, n, b);
    }
    cout << total << "\n";
    return 0;
}
